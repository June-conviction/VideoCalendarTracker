import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/supabase";

export default function HomePage() {
  const [, navigate] = useLocation();
  const { signIn, user } = useAuth();

  const handleGetStarted = () => {
    navigate("/color-picker");
  };

  const handleReturningUser = async () => {
    if (!user) {
      await signIn();
    } else {
      // If already logged in, navigate to their playlist list or dashboard
      // This would need to be implemented with a backend API call
      navigate("/color-picker");
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-4">
          Turn your boring playlist link into a mini iPod page
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Make your music links stand out with a personalized iPod-style page that showcases your taste.
        </p>
        
        {/* iPod Sample Display */}
        <div className="max-w-xs mx-auto mb-12 relative shine-effect">
          <img 
            src="https://images.unsplash.com/photo-1592841200221-a6898f307baa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=400" 
            alt="iPod nano preview" 
            className="rounded-3xl shadow-xl mx-auto"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl"></div>
        </div>
        
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={handleGetStarted}
            className="bg-[#FF2D55] hover:bg-[#FF2D55]/90 text-white font-bold py-3 px-8 rounded-full text-lg mx-auto shadow-lg transition transform hover:scale-105"
          >
            Make your own page
          </Button>
          <Button 
            variant="link" 
            onClick={handleReturningUser}
            className="text-[#007AFF] hover:underline"
          >
            Already a member?
          </Button>
        </div>
      </div>
    </div>
  );
}
