import React from 'react';
import { Share2, Globe, Mail, Send, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t-8 border-brand-red bg-bg-primary mt-24 selection:bg-brand-red selection:text-brand-dark transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 px-6 lg:px-12 py-20 w-full max-w-7xl mx-auto">
        <div className="md:col-span-4">
          <Link to="/" className="text-3xl font-black text-brand-red uppercase italic tracking-tighter mb-6 block">GG STORE</Link>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm font-light">
            The ultimate ecosystem for high-performance gaming hardware. Engineered for precision, crafted for style, and built to win.
          </p>
          <div className="flex gap-6 mt-8">
            <Twitter className="w-5 h-5 text-gray-500 cursor-pointer hover:text-brand-red transition-colors" />
            <Instagram className="w-5 h-5 text-gray-500 cursor-pointer hover:text-brand-red transition-colors" />
            <Youtube className="w-5 h-5 text-gray-500 cursor-pointer hover:text-brand-red transition-colors" />
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-mono text-[10px] font-bold text-text-primary mb-8 uppercase tracking-[0.2em] opacity-50">Hardware</h4>
          <div className="flex flex-col gap-4">
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" to="/catalog?category=keyboard">Keyboards</Link>
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" to="/catalog?category=mouse">Mice</Link>
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" to="/catalog?category=audio">Audio</Link>
            <Link className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" to="/catalog?category=accessory">Accessories</Link>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-mono text-[10px] font-bold text-text-primary mb-8 uppercase tracking-[0.2em] opacity-50">Support</h4>
          <div className="flex flex-col gap-4">
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" href="#">Manuals</a>
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" href="#">Warranty</a>
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" href="#">Contact</a>
            <a className="text-gray-400 hover:text-brand-red transition-all hover:translate-x-1 font-bold text-xs uppercase tracking-tighter" href="#">FAQ</a>
          </div>
        </div>
        
        <div className="md:col-span-4">
          <h4 className="font-mono text-[10px] font-bold text-text-primary mb-8 uppercase tracking-[0.2em] opacity-50">Newsletter</h4>
          <p className="text-gray-500 text-xs mb-6 uppercase tracking-tighter font-bold">Join the waitlist for the next modular drop.</p>
          <div className="flex gap-2">
            <input 
              className="bg-bg-secondary border border-border-subtle px-4 py-3 text-text-primary w-full text-xs outline-none focus:border-brand-red transition-colors font-mono uppercase tracking-tighter" 
              placeholder="YOUR@EMAIL.COM" 
              type="text" 
            />
            <button className="bg-brand-red text-brand-dark px-4 py-3 hover:bg-white transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-border-subtle py-10 px-6 lg:px-12 flex flex-col md:row justify-between items-center gap-6 w-full max-w-7xl mx-auto">
        <span className="text-gray-600 font-mono text-[10px] uppercase tracking-widest text-center">© 2024 GG STORE MODULAR GAMING. PIECE BY PIECE. MISSION CRITICAL HARDWARE.</span>
        <div className="flex gap-8">
          <span className="text-[10px] text-gray-600 uppercase font-mono cursor-pointer hover:text-text-primary">Privacy Policy</span>
          <span className="text-[10px] text-gray-600 uppercase font-mono cursor-pointer hover:text-text-primary">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}
