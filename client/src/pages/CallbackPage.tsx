import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";

export default function CallbackPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Log the URL params for debugging
        console.log("Callback URL:", window.location.href);
        
        // Get hash fragment or search params
        const hashParams = window.location.hash;
        const searchParams = window.location.search;
        
        console.log("Hash params:", hashParams);
        console.log("Search params:", searchParams);
        
        // Manually handle the OAuth response in case the automatic handling fails
        if (hashParams || searchParams) {
          console.log("Processing OAuth callback...");
        }
        
        // Wait a bit to ensure auth state is processed by Supabase
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Check if the user is now authenticated
        const { data } = await supabase.auth.getSession();
        console.log("Session data:", data.session ? "Session exists" : "No session");
        
        // Get the redirect URL from localStorage if it exists
        const redirectUrl = localStorage.getItem("auth_redirect") || "/";
        console.log("Redirecting to:", redirectUrl);
        
        navigate(redirectUrl);
      } catch (err) {
        console.error("Error in callback:", err);
        setError((err as Error).message);
      }
    };
    
    handleCallback();
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto text-center">
        <div className="animate-spin mb-6 mx-auto w-16 h-16 flex justify-center">
          <i className="fas fa-compact-disc text-5xl text-[#FF2D55]"></i>
        </div>
        <h2 className="text-3xl font-bold text-[#333333] mb-6">Completing login</h2>
        <p className="text-xl text-gray-600 mb-8">
          Please wait while we sign you in...
        </p>
      </div>
    </div>
  );
}