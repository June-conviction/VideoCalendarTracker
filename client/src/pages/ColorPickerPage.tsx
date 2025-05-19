import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ipodColors } from "@/assets/ipod-colors";
import { cn } from "@/lib/utils";

export default function ColorPickerPage() {
  const [, navigate] = useLocation();
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const handleColorSelect = (colorId: string) => {
    setSelectedColor(colorId);
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleContinue = () => {
    if (!selectedColor) {
      // Show an error or prompt to select a color
      return;
    }
    
    // Store the selected color in sessionStorage for later use
    sessionStorage.setItem("selectedColor", selectedColor);
    navigate("/service-selection");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#333333] mb-6">Choose your iPod color</h2>
        <p className="text-lg text-gray-600 mb-8">
          Select the color that best matches your vibe.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-2xl mx-auto mb-12">
          {ipodColors.map((color) => (
            <div 
              key={color.id}
              className={cn(
                "cursor-pointer rounded-xl p-4 hover:bg-gray-100 transition",
                selectedColor === color.id && "border-2 border-[#FF2D55] bg-gray-100"
              )}
              onClick={() => handleColorSelect(color.id)}
            >
              <div className={cn("rounded-2xl h-40 shadow-md mb-2 flex items-center justify-center", color.bgClass)}>
                <img src={color.image} alt={`${color.name} iPod`} className="h-32 object-contain" />
              </div>
              <p className="font-medium">{color.name}</p>
            </div>
          ))}
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
            onClick={handleContinue}
            disabled={!selectedColor}
            className="bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white font-bold py-3 px-8 rounded-full shadow-lg transition transform hover:scale-105 inline-flex items-center disabled:opacity-50"
          >
            Continue <i className="fas fa-arrow-right ml-2"></i>
          </Button>
        </div>
      </div>
    </div>
  );
}
