import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-6 h-6 rounded-full bg-[#FF2D55] flex items-center justify-center">
                  <i className="fas fa-music text-white text-xs"></i>
                </div>
                <span className="font-bold text-[#333333]">LinkPlaylist</span>
              </div>
            </Link>
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-[#333333] transition">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-[#333333] transition">
              Privacy
            </a>
            <a href="#" className="text-gray-600 hover:text-[#333333] transition">
              Terms
            </a>
            <a href="mailto:june@linkplaylist.xyz" className="text-gray-600 hover:text-[#333333] transition">
              Contact
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} LinkPlaylist. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
