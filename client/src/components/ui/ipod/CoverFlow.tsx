import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, PlayCircle, PauseCircle } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  image_url: string;
}

interface CoverFlowProps {
  tracks: Track[];
  onBack: () => void;
}

export default function CoverFlow({ tracks, onBack }: CoverFlowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Apply classes based on position
  const getItemClass = (index: number) => {
    if (index === currentIndex) return "coverflow-item active";
    if (index === currentIndex - 1) return "coverflow-item left";
    if (index === currentIndex + 1) return "coverflow-item right";
    if (index < currentIndex - 1) return "coverflow-item far-left";
    return "coverflow-item far-right";
  };

  const currentTrack = tracks[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-[#333333] mb-6 text-center">Cover Flow</h2>
      
      {/* Cover Flow Container */}
      <div className="coverflow relative h-80 mb-12 overflow-hidden">
        {tracks.map((track, index) => (
          <div 
            key={track.id} 
            className={getItemClass(index)}
            style={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              margin: 'auto',
              width: '12rem',
              height: '12rem'
            }}
          >
            <img 
              src={track.image_url} 
              alt={`${track.title} by ${track.artist}`} 
              className="w-full h-full object-cover rounded-lg shadow-xl" 
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 rounded-b-lg">
              <p className="text-white text-sm font-medium">{track.title}</p>
              <p className="text-white/80 text-xs">{track.artist}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Coverflow Controls */}
      <div className="flex justify-center items-center space-x-8 my-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="text-2xl text-[#333333] hover:text-[#FF2D55] transition disabled:opacity-50"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="text-3xl text-[#007AFF] hover:text-[#007AFF]/80 transition"
        >
          {isPlaying ? (
            <PauseCircle className="h-10 w-10" />
          ) : (
            <PlayCircle className="h-10 w-10" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === tracks.length - 1}
          className="text-2xl text-[#333333] hover:text-[#FF2D55] transition disabled:opacity-50"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>
      
      {/* Track Info */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-[#333333]">
          {currentTrack?.title || "No track selected"}
        </h3>
        <p className="text-gray-600">
          {currentTrack?.artist || ""}
        </p>
        <p className="text-gray-500 text-sm">
          {currentTrack?.album || ""}
        </p>
      </div>
      
      <div className="text-center">
        <Button 
          onClick={onBack}
          className="bg-[#007AFF] hover:bg-[#007AFF]/90 text-white font-bold py-2 px-6 rounded-full shadow-md transition"
        >
          Back to iPod
        </Button>
      </div>
    </div>
  );
}
