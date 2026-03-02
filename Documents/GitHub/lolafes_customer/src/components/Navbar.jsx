import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Logic for the solid black active state
  const isActive = (path) =>
    location.pathname === path
      ? "bg-black text-white shadow-md" 
      : "text-zinc-500 hover:text-black hover:bg-zinc-50"; 

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-zinc-100 px-4 md:px-10 py-4 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-2 md:w-1/4">
          <div className="bg-black p-1.5 rounded-lg flex items-center justify-center">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-5 h-5 md:w-6 md:h-6 object-contain"
            />
          </div>
          <span className="font-bold text-lg md:text-xl tracking-tight text-black whitespace-nowrap">
            Lolafe's Laundry
          </span>
        </div>

        {/* DESKTOP LINKS - Black Pill Buttons */}
        <div className="hidden md:flex flex-1 justify-center gap-4 font-bold text-sm tracking-wide">
          <Link 
            to="/" 
            className={`${isActive("/")} px-6 py-2.5 rounded-2xl transition-all duration-300`}
          >
            Home
          </Link>
          <Link
            to="/place-order"
            className={`${isActive("/place-order")} px-6 py-2.5 rounded-2xl transition-all duration-300`}
          >
            Place Order
          </Link>
          {/* ADDED: Track Order Link */}
          <Link
            to="/track"
            className={`${isActive("/track")} px-6 py-2.5 rounded-2xl transition-all duration-300`}
          >
            Track Order
          </Link>
        </div>

        {/* MOBILE TOGGLE - Square Design */}
        <button
          className={`md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 rounded-md ${
            isMenuOpen
              ? "bg-black text-white"
              : "bg-zinc-100 text-black hover:bg-zinc-200"
          }`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}></div>
          <div className={`w-5 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></div>
        </button>

        {/* RIGHT SPACER */}
        <div className="hidden md:block md:w-1/4"></div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-6 border-t mt-4 space-y-4 flex flex-col items-center font-bold text-sm bg-white animate-in slide-in-from-top duration-300">
          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className={`${isActive("/")} w-48 text-center py-3 rounded-2xl`}
          >
            Home
          </Link>
          <Link
            to="/place-order"
            onClick={() => setIsMenuOpen(false)}
            className={`${isActive("/place-order")} w-48 text-center py-3 rounded-2xl`}
          >
            Place Order
          </Link>
          {/* ADDED: Track Order Link for Mobile */}
          <Link
            to="/track"
            onClick={() => setIsMenuOpen(false)}
            className={`${isActive("/track")} w-48 text-center py-3 rounded-2xl`}
          >
            Track Order
          </Link>
        </div>
      )}
    </nav>
  );
}