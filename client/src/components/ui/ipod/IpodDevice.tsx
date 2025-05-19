import { useState } from "react";
import IpodWheel from "./IpodWheel";
import { cn } from "@/lib/utils";
import { Playlist } from "@shared/schema";

interface IpodDeviceProps {
  color: string;
  playlist: Playlist;
  currentTrack?: {
    title: string;
    artist: string;
  };
  onShowCoverFlow: () => void;
}

export default function IpodDevice({ color, playlist, currentTrack, onShowCoverFlow }: IpodDeviceProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const colorClasses = {
    silver: "bg-[hsl(var(--ipod-silver))]",
    black: "bg-[hsl(var(--ipod-black))] text-white",
    pink: "bg-[hsl(var(--ipod-pink))]",
    green: "bg-[hsl(var(--ipod-green))]",
    blue: "bg-[hsl(var(--ipod-blue))]"
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleClick = () => {
    onShowCoverFlow();
  };

  return (
    <div 
      className={cn(
        "max-w-xs mx-auto rounded-3xl shadow-xl overflow-hidden cursor-pointer transition transform hover:scale-105", 
        colorClasses[color as keyof typeof colorClasses]
      )}
      onClick={handleClick}
    >
      {/* iPod Screen */}
      <div className="ipod-screen p-3 rounded-t-3xl">
        {/* Playlist Header */}
        <div className="flex items-center justify-between mb-2 px-2">
          <h3 className="text-sm font-bold text-[#333333]">{playlist.title}</h3>
          <span className="text-xs text-gray-500">by {playlist.creator || "Artist"}</span>
        </div>
        
        {/* Playlist Cover */}
        <div className="aspect-square overflow-hidden rounded-lg mb-3 relative shine-effect">
          <img 
            src={playlist.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"} 
            alt="Playlist Cover" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-xs font-medium">{playlist.tracks?.length || 0} songs</p>
          </div>
        </div>
        
        {/* Mini Player UI */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-sm rounded-lg p-2 text-xs">
          <div className="flex items-center space-x-2">
            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-[#FF2D55]`}></i>
            <span className="font-medium">{currentTrack?.title || "No track selected"}</span>
          </div>
          <span className="text-gray-500">{currentTrack?.artist || ""}</span>
        </div>
      </div>
      
      {/* iPod Control Wheel */}
      <IpodWheel 
        onPlayPause={handlePlay} 
        isPlaying={isPlaying} 
        onMenu={() => onShowCoverFlow()}
      />
    </div>
  );
}
