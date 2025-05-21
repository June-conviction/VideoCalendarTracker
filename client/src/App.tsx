// import { Switch, Route } from "wouter";
import HomePage from "@/pages/HomePage";
import ColorPickerPage from "@/pages/ColorPickerPage";
import ServiceSelectionPage from "@/pages/ServiceSelectionPage";
import PlaylistUrlPage from "@/pages/PlaylistUrlPage";
import LoadingPage from "@/pages/LoadingPage";
import IpodPage from "@/pages/IpodPage";
import CallbackPage from "@/pages/CallbackPage";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

function App() {
  // Since we're commenting out wouter, we'll use a placeholder
  // This file will not be used in Next.js as routing is handled differently
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 pb-20">
        {/* Next.js routes are defined by the file structure in pages/ or app/ directory */}
        <HomePage />
      </main>
      <Footer />
    </div>
  );
}

export default App;
