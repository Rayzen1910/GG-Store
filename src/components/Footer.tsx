import React from 'react';
import { Share2, Globe, Mail, Send, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t-8 border-brand-red bg-bg-primary mt-24 selection:bg-brand-red selection:text-brand-dark transition-colors duration-300">
      <div className="grid grid-cols-3 md:grid-cols-12 gap-2 md:gap-12 px-4 lg:px-12 py-10 md:py-20 w-full max-w-7xl mx-auto">
        <div className="col-span-1 md:col-span-4">
          <Link to="/" className="text-[10px] md:text-3xl font-black text-brand-red uppercase italic tracking-tighter mb-2 md:mb-6 block">GG STORE</Link>
          <p className="text-gray-500 text-[6px] md:text-sm leading-tight md:leading-relaxed max-w-sm font-light hidden sm:block">
            The ultimate ecosystem for high-performance gaming hardware. Engineered for precision, crafted for style, and built to win.
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:gap-6 mt-2 md:mt-8">
            <Twitter className="w-3 h-3 md:w-5 md:h-5 text-gray-500 cursor-pointer hover:text-brand-red transition-colors" />
            <Instagram className="w-3 h-3 md:w-5 md:h-5 text-gray-500 cursor-pointer hover:text-brand-red transition-colors" />
            <Youtube className="w-3 h-3 md:w-5 md:h-5 text-gray-500 cursor-pointer hover:text-brand-red transition-colors" />
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-mono text-[7px] md:text-[10px] font-bold text-text-primary mb-2 md:mb-8 uppercase tracking-[0.2em] opacity-50">Hardware</h4>
          <div className="flex flex-col gap-2 md:gap-4">
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" to="/catalog?category=keyboard">Keyboards</Link>
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" to="/catalog?category=mouse">Mice</Link>
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" to="/catalog?category=audio">Audio</Link>
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" to="/catalog?category=accessory">Accessories</Link>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-mono text-[7px] md:text-[10px] font-bold text-text-primary mb-2 md:mb-8 uppercase tracking-[0.2em] opacity-50">Support</h4>
          <div className="flex flex-col gap-2 md:gap-4">
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" href="#">Manuals</a>
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" href="#">Warranty</a>
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" href="#">Contact</a>
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-[7px] md:text-xs uppercase tracking-tighter" href="#">FAQ</a>
          </div>
        </div>
        
        <div className="col-span-1 md:col-span-4 hidden md:block">
          <h4 className="font-mono text-[7px] md:text-[10px] font-bold text-text-primary mb-2 md:mb-8 uppercase tracking-[0.2em] opacity-50">Newsletter</h4>
          <p className="text-gray-500 text-[6px] md:text-xs mb-2 md:mb-6 uppercase tracking-tighter font-bold hidden sm:block">Join the waitlist for the next modular drop.</p>
          <div className="flex flex-col md:flex-row gap-1 md:gap-2">
            <input 
              className="bg-bg-secondary border border-border-subtle px-2 md:px-4 py-1.5 md:py-3 text-text-primary w-full text-[7px] md:text-xs outline-none focus:border-brand-red transition-colors font-mono uppercase tracking-tighter" 
              placeholder="EMAIL..." 
              type="text" 
            />
            <button className="bg-brand-red text-brand-dark px-2 md:px-4 py-1.5 md:py-3 hover:bg-white transition-colors flex items-center justify-center">
              <Send className="w-3 h-3 md:w-4 md:h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border-subtle py-4 md:py-10 px-4 md:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-2 md:gap-6 w-full max-w-7xl mx-auto">
        <span className="text-gray-600 font-mono text-[6px] md:text-[10px] uppercase tracking-widest text-center">© 2024 GG STORE MODULAR GAMING. PIECE BY PIECE. MISSION CRITICAL HARDWARE.</span>
        <div className="flex gap-4 md:gap-8">
          <span className="text-[6px] md:text-[10px] text-gray-600 uppercase font-mono cursor-pointer hover:text-text-primary">Privacy Policy</span>
          <span className="text-[6px] md:text-[10px] text-gray-600 uppercase font-mono cursor-pointer hover:text-text-primary">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
