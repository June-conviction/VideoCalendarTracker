import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPlaylistSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import fetch from "node-fetch";

// Spotify API credentials
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "14b6440f884549ff959bf023f24bf17f";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "876e09854b5b4fc78db21f688c733b70";
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || "AQA5y6dMI7AU1iZrP2PPn5ph8QW82XMR2kOjBAuseZcP2Fv2Zo9GN-dbZfk3ESLU3yD1GaOyk9aLhfGU4B8ZFNPpVtyW8gEjGqwcl3skOVhX53pHcdefBbDVNPnPiIyphGk";

// Supabase URL and key
const SB_URL = process.env.SB_URL || 'https://spifocdejillzfsksudg.supabase.co';
const SB_ANON_KEY = process.env.SB_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaWZvY2RlamlsbHpmc2tzdWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjk2NTUsImV4cCI6MjA2MzIwNTY1NX0.F3e1E_7b4MJNoC9aOxn3GTZMpvYb24OSb-911udhFps';

// Helper function to extract Spotify playlist ID from URL
function extractSpotifyPlaylistId(url: string): string | null {
  const regex = /spotify\.com\/playlist\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Helper function to extract Apple Music playlist ID from URL
function extractAppleMusicPlaylistId(url: string): string | null {
  const regex = /apple\.com\/.*\/playlist\/.*\/([a-zA-Z0-9]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Helper function to extract metadata from Apple Music playlist page
async function fetchAppleMusicPlaylist(url: string): Promise<any> {
  const cheerio = require('cheerio');
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    
    return {
      title: $('meta[property="og:title"]').attr('content') || 'Apple Music Playlist',
      description: $('meta[property="og:description"]').attr('content') || '',
      image_url: $('meta[property="og:image"]').attr('content') || '',
      creator: $('meta[name="apple:artist"]').attr('content') || 'Unknown Artist',
      tracks: [] // We can't get tracks without Apple Music API, but we'll use placeholder array
    };
  } catch (error) {
    console.error('Error scraping Apple Music playlist:', error);
    throw new Error('Failed to extract Apple Music playlist metadata');
  }
}

// Helper function to refresh Spotify access token
async function getSpotifyAccessToken(): Promise<string> {
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', SPOTIFY_REFRESH_TOKEN);

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: params
  });

  if (!response.ok) {
    throw new Error('Failed to refresh Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
}

// Helper function to fetch Spotify playlist data
async function fetchSpotifyPlaylist(playlistId: string): Promise<any> {
  const accessToken = await getSpotifyAccessToken();
  
  const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Spotify playlist');
  }

  return response.json();
}

// Helper function to invoke Supabase Edge Function
async function invokeEdgeFunction(functionName: string, body: any) {
  const response = await fetch(`${SB_URL}/functions/v1/${functionName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SB_ANON_KEY}`
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Edge function error (${response.status}): ${text}`);
  }

  return response.json();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.status(200).send('OK');
  });

  // Get a playlist by ID
  app.get('/api/playlists/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const playlist = await storage.getPlaylist(id);
      
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      res.json(playlist);
    } catch (error) {
      console.error('Error fetching playlist:', error);
      res.status(500).json({ message: 'Failed to fetch playlist', error: (error as Error).message });
    }
  });

  // Get playlists by user ID
  app.get('/api/users/:userId/playlists', async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const playlists = await storage.getPlaylistsByUser(userId);
      
      res.json(playlists);
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      res.status(500).json({ message: 'Failed to fetch user playlists', error: (error as Error).message });
    }
  });

  // Create a new playlist
  app.post('/api/playlists', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const playlistRequestSchema = z.object({
        url: z.string().url(),
        color: z.string(),
        service: z.enum(['spotify', 'apple'])
      });
      
      const { url, color, service } = playlistRequestSchema.parse(req.body);
      
      // Create user if they don't exist (simulated for development)
      let userId = "00000000-0000-0000-0000-000000000000"; // Default user ID for development
      
      // Extract the playlist ID based on the service
      let playlistId;
      if (service === 'spotify') {
        playlistId = extractSpotifyPlaylistId(url);
      } else {
        playlistId = extractAppleMusicPlaylistId(url);
      }
      
      if (!playlistId) {
        return res.status(400).json({ message: 'Invalid playlist URL' });
      }
      
      // Fetch playlist data using the Edge Function or direct API call
      let playlistData;
      
      try {
        // Try using the Edge Function
        try {
          playlistData = await invokeEdgeFunction('fetch-playlist-info', {
            playlist_url: url,
            service
          });
          console.log('Successfully fetched playlist data from Edge Function');
        } catch (edgeFunctionError) {
          // Edge function error - fall back to direct API calls
          console.error('Edge function error:', edgeFunctionError);
          throw edgeFunctionError;
        }
      } catch (error) {
        console.error('Fallback to direct API calls:', error);
        
        // Fallback to direct API calls for development
        if (service === 'spotify') {
          const spotifyData = await fetchSpotifyPlaylist(playlistId);
          
          // Transform Spotify data to our schema
          playlistData = {
            title: spotifyData.name,
            description: spotifyData.description,
            image_url: spotifyData.images[0]?.url,
            creator: spotifyData.owner.display_name,
            tracks: spotifyData.tracks.items.map((item: any) => ({
              id: item.track.id,
              title: item.track.name,
              artist: item.track.artists[0].name,
              album: item.track.album.name,
              image_url: item.track.album.images[0]?.url
            }))
          };
        } else if (service === 'apple') {
          // For Apple Music, we'll use web scraping to extract metadata
          const appleMusicData = await fetchAppleMusicPlaylist(url);
          
          // Use the scraped data
          playlistData = {
            title: appleMusicData.title,
            description: appleMusicData.description,
            image_url: appleMusicData.image_url,
            creator: appleMusicData.creator,
            tracks: appleMusicData.tracks || []
          };
        } else {
          return res.status(400).json({ message: 'Unsupported music service' });
        }
      }
      
      // Create the playlist in the database
      const playlist = await storage.createPlaylist({
        user_id: userId,
        url,
        service,
        color,
        title: playlistData.title || 'Untitled Playlist',
        description: playlistData.description || '',
        image_url: playlistData.image_url || '',
        creator: playlistData.creator || '',
        tracks: playlistData.tracks || []
      });
      
      res.status(201).json(playlist);
    } catch (error) {
      console.error('Error creating playlist:', error);
      
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      res.status(500).json({ message: 'Failed to create playlist', error: (error as Error).message });
    }
  });

  // Delete a playlist
  app.delete('/api/playlists/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      // Check if the playlist exists
      const playlist = await storage.getPlaylist(id);
      if (!playlist) {
        return res.status(404).json({ message: 'Playlist not found' });
      }
      
      // In a real app, you would check if the user is authorized to delete this playlist
      // For example: if (playlist.user_id !== req.user.id) return res.status(403)...
      
      const success = await storage.deletePlaylist(id);
      
      if (success) {
        res.json({ message: 'Playlist deleted successfully' });
      } else {
        res.status(500).json({ message: 'Failed to delete playlist' });
      }
    } catch (error) {
      console.error('Error deleting playlist:', error);
      res.status(500).json({ message: 'Failed to delete playlist', error: (error as Error).message });
    }
  });

  return httpServer;
}
