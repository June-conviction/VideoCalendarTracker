// Using direct REST API calls to Supabase

// ✅ Supabase configuration
export const SUPABASE_URL = "https://spifocdejillzfsksudg.supabase.co"
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaWZvY2RlamlsbHpmc2tzdWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjk2NTUsImV4cCI6MjA2MzIwNTY1NX0.F3e1E_7b4MJNoC9aOxn3GTZMpvYb24OSb-911udhFps"

// ✅ Spotify Authentication 
export const CLIENT_ID = "14b6440f884549ff959bf023f24bf17f"
export const CLIENT_SECRET = "876e09854b5b4fc78db21f688c733b70"
export const REFRESH_TOKEN = "AQA5y6dMI7AU1iZrP2PPn5ph8QW82XMR2kOjBAuseZcP2Fv2Zo9GN-dbZfk3ESLU3yD1GaOyk9aLhfGU4B8ZFNPpVtyW8gEjGqwcl3skOVhX53pHcdefBbDVNPnPiIyphGk"

// Get Spotify access token
export async function getAccessTokenFromRefresh() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to refresh access token: ${error}`);
  }
  
  const data = await response.json();
  return data.access_token;
}

// Function to extract Spotify playlist data
export async function getSpotifyPlaylistData(playlistUrl: string) {
  const playlistId = playlistUrl.split("/")[4]?.split("?")[0];
  
  if (!playlistId) {
    throw new Error("Invalid playlist URL");
  }

  const accessToken = await getAccessTokenFromRefresh();
  
  const spotifyResponse = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!spotifyResponse.ok) {
    const errorText = await spotifyResponse.text();
    throw new Error(`Spotify API error: ${errorText}`);
  }

  const playlistData = await spotifyResponse.json();
  
  return {
    playlistTitle: playlistData.name,
    playlistImage: playlistData.images?.[0]?.url || "",
    playlistDescription: playlistData.description || "",
    creatorName: playlistData.owner?.display_name || "",
    tracks: playlistData.tracks?.items?.map((item: any) => ({
      id: item.track.id,
      title: item.track.name,
      artist: item.track.artists[0].name,
      image_url: item.track.album.images[0]?.url || "",
    })) || [],
  };
}

// Supabase API helpers
export const supabase = {
  auth: {
    // Sign in with OAuth (Google)
    signInWithOAuth: async ({ provider, options }: { provider: string, options?: { redirectTo?: string, scopes?: string } }) => {
      try {
        // For Google Auth, we'll open a pop-up window to the Google auth URL
        const popupWidth = 500;
        const popupHeight = 600;
        const left = window.screenX + (window.outerWidth - popupWidth) / 2;
        const top = window.screenY + (window.outerHeight - popupHeight) / 2;
        
        // Since we're simulating the login flow, create a mock success response
        // In a real implementation, we would redirect to the Google auth URL
        console.log("Initiating Google login...");
        
        // In a real implementation with Supabase package, we would use:
        // const { data, error } = await supabase.auth.signInWithOAuth({
        //   provider: 'google',
        //   options: { redirectTo: window.location.origin + '/loading' }
        // });
        
        // For this demo, set user data directly in localStorage
        setTimeout(() => {
          const userData = {
            id: 'user-' + Math.random().toString(36).substring(2, 9),
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
            isAuthenticated: true
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          console.log("User data stored:", userData);
          
          // Return mock data
          return { 
            data: { url: window.location.origin + '/loading' },
            error: null 
          };
        }, 1000);
        
        return { 
          data: { url: window.location.origin + '/loading' },
          error: null 
        };
      } catch (error) {
        console.error('OAuth error:', error);
        return { data: {}, error };
      }
    },
    
    // Get the current session
    getSession: async () => {
      try {
        // In a real implementation, we would verify the session with Supabase
        // For this demo, just check localStorage
        const userData = localStorage.getItem('user');
        
        if (!userData) {
          return { data: { session: null }, error: null };
        }
        
        return { 
          data: { 
            session: JSON.parse(userData)
          }, 
          error: null 
        };
      } catch (error) {
        console.error('Session error:', error);
        return { data: { session: null }, error };
      }
    }
  },
  
  // Database operations
  from: (table: string) => ({
    // Insert data
    insert: async (records: any[]) => {
      try {
        console.log(`Inserting data into ${table}:`, records);
        
        // For demo purposes, store in localStorage
        const tableData = JSON.parse(localStorage.getItem(`supabase_${table}`) || '[]');
        tableData.push(...records);
        localStorage.setItem(`supabase_${table}`, JSON.stringify(tableData));
        
        return { error: null, data: records };
      } catch (error) {
        console.error('Insert error:', error);
        return { error, data: null };
      }
    },
    
    // Select data
    select: (columns: string) => ({
      eq: async (column: string, value: string) => {
        try {
          console.log(`Selecting from ${table} where ${column} = ${value}`);
          
          // For demo purposes, retrieve from localStorage
          const tableData = JSON.parse(localStorage.getItem(`supabase_${table}`) || '[]');
          const filteredData = tableData.filter((record: any) => record[column] === value);
          
          return { data: filteredData, error: null };
        } catch (error) {
          console.error('Select error:', error);
          return { data: [], error };
        }
      }
    })
  })
};