import React, { useState } from "react";
import Image from "next/image";
import { Search, Bell, ChevronLeft, ChevronRight, Menu, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HeaderProps {
    onMenuClick?: () => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchResults: any[];
    onPlay: (song: any) => void;
}

export default function Header({ onMenuClick, searchQuery, setSearchQuery, searchResults, onPlay }: HeaderProps) {
    const [hasNotifications, setHasNotifications] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (hasNotifications) {
            setHasNotifications(false); // Mark as read when opened
        }
    };

    return (
        <header className="h-20 flex items-center justify-between px-4 md:px-12 py-6 gap-4 relative z-50">
            {/* Mobile Menu Button */}
            <button
                onClick={onMenuClick}
                className="md:hidden p-2 text-gray-400 hover:text-white"
            >
                <Menu size={24} />
            </button>

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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for artists, songs and..."
                    className="w-full bg-[#1A1A1A] border border-white/5 rounded-full py-3 pl-12 pr-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-[#C45EFF]/50 focus:ring-1 focus:ring-[#C45EFF]/50 transition-all shadow-inner"
                />

                {/* Search Results Dropdown */}
                <AnimatePresence>
                    {searchQuery && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 right-0 mt-3 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-2"
                        >
                            {searchResults.length > 0 ? (
                                <div className="flex flex-col gap-1">
                                    <div className="px-3 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Top Results</div>
                                    {searchResults.slice(0, 3).map((song) => (
                                        <div
                                            key={song.id}
                                            onClick={() => onPlay(song)}
                                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group transition-colors"
                                        >
                                            <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                <Image src={song.image} alt={song.title} fill className="object-cover" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Play size={16} fill="white" className="text-white" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-white font-medium text-sm truncate">{song.title}</h4>
                                                <p className="text-gray-400 text-xs truncate">{song.composer}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-500 text-sm">
                                    No songs found for "{searchQuery}"
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Profile & Notif */}
            <div className="flex items-center gap-6 relative">
                <button
                    onClick={toggleNotifications}
                    className="relative text-gray-400 hover:text-white transition"
                >
                    <Bell size={22} />
                    {hasNotifications && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0D0714]"></span>
                    )}
                </button>

                {/* Notifications Popup */}
                <AnimatePresence>
                    {showNotifications && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full right-0 mt-4 w-80 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-50"
                        >
                            <div className="p-4 border-b border-white/5">
                                <h3 className="font-bold text-white">Notifications</h3>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {/* Dummy Notifications */}
                                <div className="p-4 border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                                    <p className="text-sm text-gray-300">Welcome to <span className="text-[#C45EFF] font-bold">DevTunes</span>! 🎵</p>
                                    <span className="text-xs text-gray-500 mt-1 block">Just now</span>
                                </div>
                                <div className="p-4 border-b border-white/5 hover:bg-white/5 transition cursor-pointer">
                                    <p className="text-sm text-gray-300">New Lo-Fi tracks added for deep focus.</p>
                                    <span className="text-xs text-gray-500 mt-1 block">2 hours ago</span>
                                </div>
                                <div className="p-4 hover:bg-white/5 transition cursor-pointer">
                                    <p className="text-sm text-gray-300">Try our new "Performance Mode" in settings.</p>
                                    <span className="text-xs text-gray-500 mt-1 block">1 day ago</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
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
