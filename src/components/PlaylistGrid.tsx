import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Music } from "lucide-react";

interface Playlist {
    id: number;
    title: string;
    count: string;
    image: string;
    color: string;
}

interface PlaylistGridProps {
    playlists: Playlist[];
}

export default function PlaylistGrid({ playlists }: PlaylistGridProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Playlist Cards (Col 8) */}
            <div className="lg:col-span-8">
                <div className="flex justify-between items-end mb-4">
                    <h2 className="text-xl font-bold">Playlists</h2>
                    <Link href="#" className="text-sm text-gray-500 hover:text-white transition">More &gt;</Link>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {playlists.map((pl) => (
                        <div key={pl.id} className="group relative aspect-square rounded-[2rem] overflow-hidden cursor-pointer">
                            <Image src={pl.image} alt={pl.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute bottom-0 left-0 w-full p-5 bg-gradient-to-t from-black/80 to-transparent">
                                <h3 className="font-bold text-lg leading-tight mb-1">{pl.title}</h3>
                                <p className="text-xs text-gray-400">{pl.count}</p>
                            </div>
                            <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                <Play size={12} fill="white" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Upgrade Banner (Col 4) */}
            <div className="lg:col-span-4 flex flex-col">
                <div className="h-8 mb-4"></div> {/* Spacer to align with title */}
                <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-6 flex flex-col justify-center items-center text-center shadow-2xl shadow-purple-500/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <h3 className="text-2xl font-bold mb-2 relative z-10">Upgrade<br />your account</h3>
                    <p className="text-xs text-white/80 mb-6 relative z-10">Get full access to high quality audio and offline mode.</p>
                    <button className="bg-white text-black px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform shadow-lg relative z-10">
                        Upgrade Now
                    </button>
                    {/* Decorative 3D Element simulation */}
                    <div className="absolute bottom-[-20px] right-[-20px] opacity-20 rotate-12">
                        <Music size={120} />
                    </div>
                </div>
            </div>
        </div>
    );
}
