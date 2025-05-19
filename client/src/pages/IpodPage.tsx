import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import IpodDevice from "@/components/ui/ipod/IpodDevice";
import CoverFlow from "@/components/ui/ipod/CoverFlow";
import { useAuth } from "@/lib/supabase";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Share2, Twitter, Facebook } from "lucide-react";

export default function IpodPage() {
  const [, params] = useRoute<{ id: string }>("/ipod/:id");
  const [showCoverFlow, setShowCoverFlow] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const playlistId = params?.id;

  // Fetch playlist data
  const { data: playlist, isLoading, error } = useQuery({
    queryKey: [`/api/playlists/${playlistId}`],
    enabled: !!playlistId
  });

  // Delete playlist mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/playlists/${playlistId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Playlist deleted successfully!",
      });
      // Redirect to home page
      window.location.href = "/";
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to delete playlist",
        variant: "destructive",
      });
    }
  });

  // Handle sharing
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast({
          title: "Link copied",
          description: "Share link copied to clipboard!",
        });
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      });
  };

  // Check if user is the owner of the playlist
  const isOwner = user && playlist && user.id === playlist.user_id;

  // Handle delete
  const handleDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-spin mb-6 mx-auto w-16 h-16 flex justify-center">
          <i className="fas fa-compact-disc text-5xl text-[#FF2D55]"></i>
        </div>
        <h2 className="text-xl font-bold text-[#333333]">Loading your iPod page...</h2>
      </div>
    );
  }

  if (error || !playlist) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Playlist</h2>
        <p className="text-gray-600 mb-6">
          {(error as Error)?.message || "The playlist could not be found or may have been deleted."}
        </p>
        <Button 
          onClick={() => window.location.href = "/"}
          className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-bold py-2 px-6 rounded-full shadow-md transition"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  const currentTrack = playlist.tracks && playlist.tracks.length > 0 
    ? { 
        title: playlist.tracks[currentTrackIndex].title,
        artist: playlist.tracks[currentTrackIndex].artist
      }
    : undefined;

  return (
    <div className="container mx-auto px-4 py-12">
      {showCoverFlow ? (
        <CoverFlow 
          tracks={playlist.tracks || []} 
          onBack={() => setShowCoverFlow(false)} 
        />
      ) : (
        <>
          {/* iPod Container */}
          <IpodDevice 
            color={playlist.color || "silver"} 
            playlist={playlist}
            currentTrack={currentTrack}
          />
          
          {/* Controls Under iPod */}
          <div className="max-w-xs mx-auto mt-8 flex flex-col items-center">
            <Button 
              onClick={() => setShowCoverFlow(true)}
              className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-bold py-2 px-6 rounded-full shadow-md transition mb-4"
            >
              View Cover Flow
            </Button>
            
            {/* Delete Button (Only visible to owner) */}
            {isOwner && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-md transition"
                  >
                    Delete Playlist
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your iPod playlist page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            
            {/* Share Links */}
            <div className="flex space-x-4 mt-4">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleShare}
                className="text-gray-600 hover:text-[#333333] transition"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Check%20out%20my%20iPod%20playlist&url=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="text-gray-600 hover:text-[#333333] transition"
              >
                <Twitter className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
                className="text-gray-600 hover:text-[#333333] transition"
              >
                <Facebook className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
