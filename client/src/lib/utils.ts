import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Validate playlist URLs
export function isValidPlaylistUrl(url: string): { isValid: boolean; service: 'spotify' | 'apple' | null } {
  const trimmedUrl = url.trim();
  
  // Spotify playlist URL pattern
  const spotifyPattern = /^https:\/\/(open\.spotify\.com\/playlist\/|spotify\.com\/playlist\/)([a-zA-Z0-9]+)(\?.*)?$/;
  
  // Apple Music playlist URL pattern
  const applePattern = /^https:\/\/(music\.apple\.com\/.*\/playlist\/.*\/|itunes\.apple\.com\/.*\/playlist\/.*)([a-zA-Z0-9]+)(\?.*)?$/;
  
  if (spotifyPattern.test(trimmedUrl)) {
    return { isValid: true, service: 'spotify' };
  }
  
  if (applePattern.test(trimmedUrl)) {
    return { isValid: true, service: 'apple' };
  }
  
  return { isValid: false, service: null };
}

// Format a user-friendly display name from an email
export function formatDisplayName(email: string): string {
  if (!email) return 'User';
  
  // Remove everything after @ symbol and capitalize first letter
  const name = email.split('@')[0];
  return name.charAt(0).toUpperCase() + name.slice(1);
}

// Generate a random quote about music
export const getMusicQuote = (): string => {
  const quotes = [
    "Your taste/playlist deserves more audience.",
    "Music gives a soul to the universe, wings to the mind, flight to the imagination.",
    "Where words fail, music speaks.",
    "Without music, life would be a mistake.",
    "Music is the soundtrack of your life.",
    "Music in the soul can be heard by the universe."
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};
