import { Switch, Route } from "wouter";
import HomePage from "@/pages/HomePage";
import ColorPickerPage from "@/pages/ColorPickerPage";
import ServiceSelectionPage from "@/pages/ServiceSelectionPage";
import PlaylistUrlPage from "@/pages/PlaylistUrlPage";
import LoadingPage from "@/pages/LoadingPage";
import IpodPage from "@/pages/IpodPage";
import NotFound from "@/pages/not-found";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-16 pb-20">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/color-picker" component={ColorPickerPage} />
          <Route path="/service-selection" component={ServiceSelectionPage} />
          <Route path="/playlist-url" component={PlaylistUrlPage} />
          <Route path="/loading" component={LoadingPage} />
          <Route path="/ipod/:id" component={IpodPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

export default App;
