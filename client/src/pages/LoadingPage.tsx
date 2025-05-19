import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { getMusicQuote } from "@/lib/utils";
import { useAuth } from "@/lib/supabase";

export default function LoadingPage() {
  const [, navigate] = useLocation();
  const [progress, setProgress] = useState(0);
  const [showAuth, setShowAuth] = useState(false);
  const [quote] = useState(getMusicQuote());
  const { user, signIn, loading } = useAuth();
  
  // Get playlist ID from sessionStorage
  const playlistId = sessionStorage.getItem("playlistId");

  useEffect(() => {
    // Always ensure progress starts from 0
    setProgress(0);
    
    // First progress phase - simulate to 60%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 60) {
          clearInterval(interval);
          setShowAuth(true);
          return 60;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Middle progress phase - move to 80% when showing auth
    if (showAuth && progress === 60) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(interval);
            return 80;
          }
          return prev + 5;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [showAuth, progress]);

  useEffect(() => {
    // If user is already authenticated, complete the progress and navigate
    if (user && showAuth) {
      completeProgressAndNavigate();
    }
  }, [user, showAuth]);

  const handleGoogleAuth = async () => {
    try {
      await signIn();
      // Navigation will happen in the useEffect when user state changes
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const completeProgressAndNavigate = () => {
    // Complete the progress from 70% to 100%
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Navigate to the iPod page with the playlist ID
          if (playlistId) {
            navigate(`/ipod/${playlistId}`);
          } else {
            // Fallback if something went wrong
            navigate("/");
          }
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="animate-spin mb-6 mx-auto w-16 h-16 flex justify-center">
          <i className="fas fa-compact-disc text-5xl text-[#FF2D55]"></i>
        </div>
        <h2 className="text-3xl font-bold text-[#333333] mb-6">Creating your iPod page</h2>
        <p className="text-xl text-gray-600 mb-8">
          {quote}
        </p>
        
        {/* Progress Bar */}
        <div className="w-full max-w-md mx-auto mb-8">
          <Progress value={progress} className="h-2.5" />
        </div>
        
        {/* Google Auth Button that appears after progress reaches 70% */}
        {showAuth && !user && (
          <div className="mt-8 animate-fade-in">
            <p className="text-lg text-gray-600 mb-4">Almost done! Sign in to save your page:</p>
            <Button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="bg-white hover:bg-gray-50 text-gray-800 font-medium py-3 px-8 rounded-lg border border-gray-300 shadow inline-flex items-center justify-center transition"
            >
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google logo" className="w-5 h-5 mr-3" />
              Continue with Google
              {loading && <i className="fas fa-spinner fa-spin ml-2"></i>}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
