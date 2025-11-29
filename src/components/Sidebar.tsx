import React from "react";
import { Home, Music, User, Settings } from "lucide-react";

import Link from "next/link";

export default function Sidebar() {
    const NAV_ITEMS = [
        { icon: Home, href: "/" },
        { icon: Music, href: "/" },
        { icon: User, href: "/about" },
        { icon: Settings, href: "#" }
    ];

    return (
        <aside className="hidden md:flex w-24 flex-col items-center py-8 gap-8 z-20 border-r border-white/5 bg-white/[0.02] backdrop-blur-md">
            {/* Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#C45EFF] to-purple-800 flex items-center justify-center shadow-lg shadow-purple-500/30 mb-4">
                <Music size={20} className="text-white" />
            </div>

            {/* Nav Icons */}
            <nav className="flex flex-col gap-6 w-full px-4">
                {NAV_ITEMS.map((item, idx) => (
                    <Link
                        key={idx}
                        href={item.href}
                        className={`p-3 rounded-2xl flex items-center justify-center transition-all duration-300 group relative
                      ${idx === 0 ? 'bg-white/10 text-white shadow-inner' : 'text-gray-500 hover:text-white hover:bg-white/5'}
                  `}
                    >
                        <item.icon size={22} strokeWidth={2} />
                        {idx === 0 && <div className="absolute left-0 w-1 h-6 bg-[#C45EFF] rounded-r-full" />}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
