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
        "max-w-xs mx-auto rounded-3xl shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]", 
        colorClasses[color as keyof typeof colorClasses]
      )}
      onClick={handleClick}
    >
      {/* iPod Screen */}
      <div className="ipod-screen p-4 rounded-t-3xl border-b-2 border-gray-200">
        {/* Playlist Header */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-[#333333] truncate">{playlist.title}</h3>
            <span className="text-xs text-gray-500 opacity-80">by {playlist.creator || "Artist"}</span>
          </div>
          <div className="rounded-full bg-[#FF2D55]/10 p-1.5">
            <i className="fas fa-music text-[#FF2D55] text-xs"></i>
          </div>
        </div>
        
        {/* Playlist Cover with Enhanced Effect */}
        <div className="aspect-square overflow-hidden rounded-xl mb-3 relative shine-effect shadow-lg group">
          <img 
            src={playlist.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"} 
            alt="Playlist Cover" 
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
          />
          {/* Fancy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70"></div>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="flex justify-between items-center">
              <p className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">
                <i className="fas fa-list-ul mr-1"></i> {playlist.tracks?.length || 0} songs
              </p>
              <span className="bg-white/20 backdrop-blur-md rounded-full p-1.5">
                <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xs`}></i>
              </span>
            </div>
          </div>
        </div>
        
        {/* Enhanced Mini Player UI */}
        <div className="glass-effect rounded-xl p-3 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="rounded-full bg-[#FF2D55] p-1.5 shadow">
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xs`}></i>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{currentTrack?.title || "No track selected"}</p>
              <p className="text-gray-500 text-xs truncate">{currentTrack?.artist || "Unknown artist"}</p>
            </div>
          </div>
          <div className="text-[#FF2D55]">
            <i className="fas fa-heart"></i>
          </div>
        </div>
      </div>
      
      {/* iPod Control Wheel with Enhanced Styling */}
      <IpodWheel 
        onPlayPause={handlePlay} 
        isPlaying={isPlaying} 
        onMenu={() => onShowCoverFlow()}
      />
    </div>
  );
}
