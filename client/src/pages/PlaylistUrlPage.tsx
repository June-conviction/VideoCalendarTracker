import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidPlaylistUrl } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { API_BASE_URL } from "@/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function PlaylistUrlPage() {
  const [, navigate] = useLocation();
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Get previously selected options from sessionStorage
  const selectedColor = sessionStorage.getItem("selectedColor") || "silver";
  const selectedService = sessionStorage.getItem("selectedService") || "spotify";

  const handleBack = () => {
    navigate("/service-selection");
  };

  const mutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await apiRequest("POST", "/api/playlists", {
        url,
        color: selectedColor,
        service: selectedService
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Store playlist ID in sessionStorage to pass to loading page
      sessionStorage.setItem("playlistId", data.id);
      navigate("/loading");
    },
    onError: (error) => {
      setError((error as Error).message || "Failed to submit playlist URL");
    }
  });

  const handleSubmit = () => {
    setError(null);
    
    // Validate the URL format
    const { isValid, service } = isValidPlaylistUrl(playlistUrl);
    
    if (!isValid) {
      setError("Please enter a valid Spotify or Apple Music playlist URL.");
      return;
    }
    
    // Check if the service matches the selected service
    if (service !== selectedService) {
      setError(`The URL you entered appears to be for ${service === 'spotify' ? 'Spotify' : 'Apple Music'}, but you selected ${selectedService === 'spotify' ? 'Spotify' : 'Apple Music'}. Please enter a URL that matches your selected service.`);
      return;
    }

    // Submit the playlist URL
    mutation.mutate(playlistUrl);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#333333] mb-6">Paste your playlist URL</h2>
        <p className="text-lg text-gray-600 mb-8">
          Copy and paste the link to your {selectedService === 'spotify' ? 'Spotify' : 'Apple Music'} playlist.
        </p>
        
        <div className="max-w-lg mx-auto">
          <div className="flex flex-col space-y-4 mb-8">
            <Input
              type="text"
              placeholder={`https://${selectedService === 'spotify' ? 'open.spotify.com/playlist/...' : 'music.apple.com/playlist/...'}`}
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#007AFF] focus:ring-2 focus:ring-[#007AFF]/20 focus:outline-none transition"
            />
            
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-4">
            <Button 
              variant="link" 
              onClick={handleBack}
              className="text-[#007AFF] hover:underline"
            >
              <i className="fas fa-arrow-left mr-1"></i> Back
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!playlistUrl.trim() || mutation.isPending}
              className="bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 inline-flex items-center disabled:opacity-50"
            >
              {mutation.isPending ? "Submitting..." : "Submit"} <i className={`fas fa-${mutation.isPending ? 'spinner fa-spin' : 'check'} ml-2`}></i>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
