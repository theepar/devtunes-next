import React from "react";
import { Home, Music, User, Settings, X } from "lucide-react";

import Link from "next/link";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
    const NAV_ITEMS = [
        { icon: Home, href: "/" },
        { icon: Music, href: "/" },
        { icon: User, href: "/about" },
        { icon: Settings, href: "/settings" }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#0D0714] border-r border-white/10 shadow-2xl transform transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0 md:w-24 md:bg-white/[0.02] md:shadow-none md:border-white/5 md:backdrop-blur-md
                flex flex-col items-center py-8 gap-8
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Mobile Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white md:hidden"
                >
                    <X size={24} />
                </button>

                {/* Logo */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C45EFF] to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4 shrink-0">
                    <Music size={20} className="text-white" />
                </div>

                {/* Nav Icons */}
                <nav className="flex flex-col gap-6 w-full px-4">
                    {NAV_ITEMS.map((item, idx) => (
                        <Link
                            key={idx}
                            href={item.href}
                            onClick={onClose}
                            className={`p-3 rounded-2xl flex items-center gap-4 md:justify-center transition-all duration-300 group relative
                      ${idx === 0 ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                  `}
                        >
                            <item.icon size={22} strokeWidth={2} />
                            <span className="md:hidden font-medium">{idx === 0 ? 'Home' : idx === 1 ? 'Library' : idx === 2 ? 'About' : 'Settings'}</span>
                            {idx === 0 && <div className="absolute left-0 w-1 h-6 bg-[#C45EFF] rounded-r-full hidden md:block" />}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
