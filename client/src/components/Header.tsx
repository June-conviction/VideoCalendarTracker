import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm fixed top-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-[#FF2D55] flex items-center justify-center">
              <i className="fas fa-music text-white text-sm"></i>
            </div>
            <h1 className="text-xl font-bold text-[#333333]">LinkPlaylist</h1>
          </div>
        </Link>
        
        <div ref={menuRef}>
          <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="p-2 rounded-md hover:bg-gray-100 transition">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/" className="w-full">Make my iPod</Link>
              </DropdownMenuItem>
              {!user ? (
                <DropdownMenuItem asChild>
                  <Link href="/" className="w-full">Log in</Link>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onSelect={() => signOut()}>Log out</DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <a href="mailto:june@linkplaylist.xyz" className="w-full">Contact</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
