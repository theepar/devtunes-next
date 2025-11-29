import React from "react";
import Image from "next/image";
import { Search, Bell, ChevronLeft, ChevronRight } from "lucide-react";

export default function Header() {
    return (
        <header className="h-20 flex items-center justify-between px-8 md:px-12 py-6">
            {/* Nav Arrows */}
            <div className="hidden md:flex gap-4">
                <button className="text-gray-400 hover:text-white transition"><ChevronLeft size={24} /></button>
                <button className="text-gray-400 hover:text-white transition"><ChevronRight size={24} /></button>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4 md:mx-12 relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#C45EFF] transition-colors" />
                <input
                    type="text"
                    placeholder="Search for artists, songs and..."
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-full py-3 pl-12 pr-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#C45EFF]/50 focus:ring-1 focus:ring-[#C45EFF]/50 transition-all shadow-inner"
                />
            </div>

            {/* Profile & Notif */}
            <div className="flex items-center gap-6">
                <button className="relative text-gray-400 hover:text-white transition">
                    <Bell size={22} />
                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D0714]"></span>
                </button>
                <a
                    href="https://devagundhala.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-[2px] cursor-pointer group"
                >
                    <div className="w-full h-full rounded-full bg-[#1A1A1A] overflow-hidden">
                        <Image
                            src="https://devagundhala.site/img/profile.jpg"
                            width={40}
                            height={40}
                            alt="User"
                            className="object-cover w-full h-full opacity-90 group-hover:opacity-100 transition"
                        />
                    </div>
                </a>
            </div>
        </header>
    );
}
