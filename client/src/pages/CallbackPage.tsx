import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/supabase";

export default function CallbackPage() {
  const [, navigate] = useLocation();

  useEffect(() => {
    // This page will be hit after the OAuth redirect
    // Supabase will handle the token automatically
    
    // Let's just show a message that we're processing the login
    console.log("Processing OAuth callback...");
    
    // After a brief timeout, redirect to the home page
    // The auth state should be updated automatically by Supabase
    const timer = setTimeout(() => {
      // Get the redirect URL from localStorage if it exists
      const redirectUrl = localStorage.getItem("auth_redirect") || "/";
      navigate(redirectUrl);
    }, 1000);
    
    return () => clearTimeout(timer);
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