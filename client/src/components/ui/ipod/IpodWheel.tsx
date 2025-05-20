interface IpodWheelProps {
  onPlayPause: () => void;
  isPlaying: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onMenu?: () => void;
}

export default function IpodWheel({ 
  onPlayPause, 
  isPlaying, 
  onPrevious = () => {}, 
  onNext = () => {}, 
  onMenu = () => {} 
}: IpodWheelProps) {
  return (
    <div className="rounded-b-3xl bg-white p-6">
      <div className="w-full aspect-square rounded-full flex items-center justify-center relative bg-gradient-to-br from-[#e6e6e6] to-white shadow-[inset_0_0_10px_rgba(0,0,0,0.1),0_4px_15px_rgba(0,0,0,0.1)]">
        {/* Center Button */}
        <button 
          className="absolute inset-1/4 bg-gradient-to-br from-white to-[#f5f5f7] rounded-full shadow-[0_4px_6px_rgba(0,0,0,0.1),inset_0_2px_3px_rgba(255,255,255,0.5)] hover:shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_2px_3px_rgba(255,255,255,0.5)] active:shadow-[inset_0_2px_5px_rgba(0,0,0,0.1)] transition-all duration-150 overflow-hidden"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        ></button>
        
        {/* Menu Button */}
        <button 
          className="absolute top-6 inset-x-0 mx-auto text-center hover:text-[#FF2D55] transition-colors duration-150"
          onClick={onMenu}
          aria-label="Menu"
        >
          <div className="font-bold text-xs tracking-wide">MENU</div>
        </button>
        
        {/* Previous Button */}
        <button 
          className="absolute left-7 inset-y-0 my-auto hover:text-[#FF2D55] transition-colors duration-150 transform hover:scale-110"
          onClick={onPrevious}
          aria-label="Previous"
        >
          <i className="fas fa-backward"></i>
        </button>
        
        {/* Next Button */}
        <button 
          className="absolute right-7 inset-y-0 my-auto hover:text-[#FF2D55] transition-colors duration-150 transform hover:scale-110"
          onClick={onNext}
          aria-label="Next"
        >
          <i className="fas fa-forward"></i>
        </button>
        
        {/* Play/Pause Button */}
        <button 
          className="absolute bottom-6 inset-x-0 mx-auto text-center hover:text-[#FF2D55] transition-colors duration-150"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <i className={`fas fa-${isPlaying ? 'pause' : 'play'}`}></i>
        </button>
      </div>
      
      {/* iPod Branding */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-400 font-light">
          LinkPlaylist™
        </p>
      </div>
    </div>
  );
}
