import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export default function ServiceSelectionPage() {
  const [, navigate] = useLocation();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  const handleServiceSelect = (service: string) => {
    if (service === "other") {
      setShowError(true);
      return;
    }
    
    setSelectedService(service);
    setShowError(false);
  };

  const handleBack = () => {
    navigate("/color-picker");
  };

  const handleContinue = () => {
    if (!selectedService) {
      setShowError(true);
      return;
    }
    
    // Store the selected service in sessionStorage for later use
    sessionStorage.setItem("selectedService", selectedService);
    navigate("/playlist-url");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#333333] mb-6">Choose your streaming service</h2>
        <p className="text-lg text-gray-600 mb-8">
          We currently support Spotify and Apple Music playlists.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
          {/* Spotify Option */}
          <div 
            className={`cursor-pointer rounded-xl p-6 border-2 ${
              selectedService === "spotify" ? "border-[#007AFF] bg-gray-50" : "border-transparent"
            } hover:border-[#007AFF] transition flex flex-col items-center`}
            onClick={() => handleServiceSelect("spotify")}
          >
            <div className="bg-black rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <i className="fab fa-spotify text-white text-4xl"></i>
            </div>
            <p className="font-medium text-lg">Spotify</p>
          </div>
          
          {/* Apple Music Option */}
          <div 
            className={`cursor-pointer rounded-xl p-6 border-2 ${
              selectedService === "apple" ? "border-[#007AFF] bg-gray-50" : "border-transparent"
            } hover:border-[#007AFF] transition flex flex-col items-center`}
            onClick={() => handleServiceSelect("apple")}
          >
            <div className="bg-white rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow">
              <i className="fab fa-apple text-black text-4xl"></i>
            </div>
            <p className="font-medium text-lg">Apple Music</p>
          </div>
          
          {/* Other Services Option (Disabled) */}
          <div 
            className="cursor-not-allowed rounded-xl p-6 border-2 border-transparent bg-gray-100 flex flex-col items-center opacity-70"
            onClick={() => handleServiceSelect("other")}
          >
            <div className="bg-gray-200 rounded-full w-20 h-20 flex items-center justify-center mb-4">
              <i className="fas fa-music text-gray-500 text-4xl"></i>
            </div>
            <p className="font-medium text-lg">Others</p>
            <p className="text-sm text-gray-500 mt-1">Coming soon</p>
          </div>
        </div>
        
        {showError && (
          <Alert variant="destructive" className="mb-6 max-w-md mx-auto">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              My bad, we're currently Apple Music & Spotify friendly only.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-center justify-center space-x-4">
          <Button 
            variant="link" 
            onClick={handleBack}
            className="text-[#007AFF] hover:underline"
          >
            <i className="fas fa-arrow-left mr-1"></i> Back
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedService}
            className="bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 inline-flex items-center disabled:opacity-50"
          >
            Continue <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
