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
    <div className="ipod-wheel rounded-b-3xl bg-white p-6">
      <div className="w-full aspect-square rounded-full ipod-wheel flex items-center justify-center relative">
        {/* Center Button */}
        <button 
          className="absolute inset-1/4 bg-white rounded-full ipod-button shadow-sm"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        ></button>
        
        {/* Menu Button */}
        <button 
          className="absolute top-4 inset-x-0 mx-auto text-center ipod-button"
          onClick={onMenu}
          aria-label="Menu"
        >
          <div className="font-bold text-xs text-[#333333]">MENU</div>
        </button>
        
        {/* Previous Button */}
        <button 
          className="absolute left-4 inset-y-0 my-auto ipod-button"
          onClick={onPrevious}
          aria-label="Previous"
        >
          <i className="fas fa-backward text-[#333333]"></i>
        </button>
        
        {/* Next Button */}
        <button 
          className="absolute right-4 inset-y-0 my-auto ipod-button"
          onClick={onNext}
          aria-label="Next"
        >
          <i className="fas fa-forward text-[#333333]"></i>
        </button>
        
        {/* Play/Pause Button */}
        <button 
          className="absolute bottom-4 inset-x-0 mx-auto text-center ipod-button"
          onClick={onPlayPause}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          <i className={`fas fa-${isPlaying ? 'pause' : 'play'} text-[#333333]`}></i>
        </button>
      </div>
    </div>
  );
}
