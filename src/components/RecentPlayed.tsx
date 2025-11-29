import React from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

interface Song {
    id: number | string;
    title: string;
    composer: string;
    image: string;
    duration: number;
}

interface RecentPlayedProps {
    songs: Song[];
    activeIndex: number;
    isPlaying: boolean;
    onSelect: (index: number) => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function RecentPlayed({ songs, activeIndex, isPlaying, onSelect }: RecentPlayedProps) {
    return (
        <div className="lg:col-span-8">
            <h2 className="text-xl font-bold mb-4">Recently played</h2>
            <div className="space-y-2">
                {songs.map((song, idx) => (
                    <div
                        key={idx}
                        onClick={() => onSelect(idx)}
                        className={`flex items-center gap-4 p-3 rounded-2xl transition-all cursor-pointer group border border-transparent ${idx === activeIndex ? 'bg-white/10 border-white/5' : 'hover:bg-white/5'}`}
                    >
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md">
                            <Image src={song.image} alt={song.title} fill className="object-cover" />
                            {idx === activeIndex && isPlaying && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="flex gap-0.5 items-end h-3">
                                        <span className="w-1 bg-[#C45EFF] animate-[bounce_1s_infinite] h-full rounded-full"></span>
                                        <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-2/3 rounded-full"></span>
                                        <span className="w-1 bg-[#C45EFF] animate-[bounce_0.8s_infinite] h-full rounded-full"></span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className={`font-bold text-sm truncate ${idx === activeIndex ? 'text-[#C45EFF]' : 'text-white'}`}>{song.title}</h4>
                            <p className="text-xs text-gray-500">{song.composer}</p>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <span className="text-xs text-gray-500 font-mono">{formatTime(song.duration)}</span>
                            <div className="flex gap-1 text-yellow-500 text-[10px]">
                                <span>★</span><span>★</span><span>★</span>
                            </div>
                            <MoreHorizontal size={16} className="text-gray-500 hover:text-white" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
