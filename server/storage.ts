import { 
  playlists, 
  users, 
  userFollows, 
  type Playlist, 
  type InsertPlaylist, 
  type User, 
  type InsertUser, 
  type UserFollow 
} from "@shared/schema";
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabaseUrl = process.env.SB_URL || 'https://spifocdejillzfsksudg.supabase.co';
const supabaseAnonKey = process.env.SB_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwaWZvY2RlamlsbHpmc2tzdWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2Mjk2NTUsImV4cCI6MjA2MzIwNTY1NX0.F3e1E_7b4MJNoC9aOxn3GTZMpvYb24OSb-911udhFps';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: InsertUser): Promise<User>;
  
  // Playlist operations
  getPlaylist(id: string): Promise<Playlist | null>;
  getPlaylistsByUser(userId: string): Promise<Playlist[]>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, playlist: Partial<Playlist>): Promise<Playlist | null>;
  deletePlaylist(id: string): Promise<boolean>;
  
  // User follow operations
  followUser(followerId: string, followingId: string): Promise<UserFollow>;
  unfollowUser(followerId: string, followingId: string): Promise<boolean>;
  getFollowers(userId: string): Promise<User[]>;
  getFollowing(userId: string): Promise<User[]>;
}

export class SupabaseStorage implements IStorage {
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  // User operations
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data as User;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await this.supabase
      .from('users')
      .insert(user)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  // Playlist operations
  async getPlaylist(id: string): Promise<Playlist | null> {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Playlist;
  }

  async getPlaylistsByUser(userId: string): Promise<Playlist[]> {
    const { data, error } = await this.supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data as Playlist[];
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const { data, error } = await this.supabase
      .from('playlists')
      .insert(playlist)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create playlist: ${error.message}`);
    return data as Playlist;
  }

  async updatePlaylist(id: string, playlist: Partial<Playlist>): Promise<Playlist | null> {
    const { data, error } = await this.supabase
      .from('playlists')
      .update(playlist)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return null;
    return data as Playlist;
  }

  async deletePlaylist(id: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('playlists')
      .delete()
      .eq('id', id);
    
    return !error;
  }

  // User follow operations
  async followUser(followerId: string, followingId: string): Promise<UserFollow> {
    const { data, error } = await this.supabase
      .from('user_follows')
      .insert({
        follower_id: followerId,
        following_id: followingId,
        status: 'active'
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to follow user: ${error.message}`);
    return data as UserFollow;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const { error } = await this.supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    
    return !error;
  }

  async getFollowers(userId: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('user_follows')
      .select('follower_id')
      .eq('following_id', userId)
      .eq('status', 'active');
    
    if (error || !data.length) return [];
    
    const followerIds = data.map(item => item.follower_id);
    const { data: followers, error: followersError } = await this.supabase
      .from('users')
      .select('*')
      .in('id', followerIds);
    
    if (followersError) return [];
    return followers as User[];
  }

  async getFollowing(userId: string): Promise<User[]> {
    const { data, error } = await this.supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId)
      .eq('status', 'active');
    
    if (error || !data.length) return [];
    
    const followingIds = data.map(item => item.following_id);
    const { data: following, error: followingError } = await this.supabase
      .from('users')
      .select('*')
      .in('id', followingIds);
    
    if (followingError) return [];
    return following as User[];
  }
}

// Fallback to memory storage for local development
export class MemStorage implements IStorage {
  private users = new Map<string, User>();
  private playlists = new Map<string, Playlist>();
  private follows = new Map<string, UserFollow>();

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return Array.from(this.users.values()).find(user => user.email === email) || null;
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = crypto.randomUUID();
    const newUser: User = {
      ...user,
      id,
      created_at: new Date()
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async getPlaylist(id: string): Promise<Playlist | null> {
    return this.playlists.get(id) || null;
  }

  async getPlaylistsByUser(userId: string): Promise<Playlist[]> {
    return Array.from(this.playlists.values())
      .filter(playlist => playlist.user_id === userId)
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
  }

  async createPlaylist(playlist: InsertPlaylist): Promise<Playlist> {
    const id = crypto.randomUUID();
    const now = new Date();
    const newPlaylist: Playlist = {
      ...playlist,
      id,
      created_at: now,
      updated_at: now
    };
    this.playlists.set(id, newPlaylist);
    return newPlaylist;
  }

  async updatePlaylist(id: string, playlist: Partial<Playlist>): Promise<Playlist | null> {
    const existing = this.playlists.get(id);
    if (!existing) return null;
    
    const updated: Playlist = {
      ...existing,
      ...playlist,
      updated_at: new Date()
    };
    this.playlists.set(id, updated);
    return updated;
  }

  async deletePlaylist(id: string): Promise<boolean> {
    return this.playlists.delete(id);
  }

  async followUser(followerId: string, followingId: string): Promise<UserFollow> {
    const id = crypto.randomUUID();
    const follow: UserFollow = {
      id,
      follower_id: followerId,
      following_id: followingId,
      status: 'active',
      blocked_by: null,
      created_at: new Date()
    };
    this.follows.set(id, follow);
    return follow;
  }

  async unfollowUser(followerId: string, followingId: string): Promise<boolean> {
    const follow = Array.from(this.follows.values()).find(
      f => f.follower_id === followerId && f.following_id === followingId
    );
    if (!follow) return false;
    return this.follows.delete(follow.id);
  }

  async getFollowers(userId: string): Promise<User[]> {
    const followerIds = Array.from(this.follows.values())
      .filter(f => f.following_id === userId && f.status === 'active')
      .map(f => f.follower_id);
    
    return Array.from(this.users.values())
      .filter(user => followerIds.includes(user.id));
  }

  async getFollowing(userId: string): Promise<User[]> {
    const followingIds = Array.from(this.follows.values())
      .filter(f => f.follower_id === userId && f.status === 'active')
      .map(f => f.following_id);
    
    return Array.from(this.users.values())
      .filter(user => followingIds.includes(user.id));
  }
}

// Use Supabase in production, MemStorage for local development
export const storage = process.env.NODE_ENV === 'production'
  ? new SupabaseStorage()
  : new MemStorage();
