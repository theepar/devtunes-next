import React from "react";
import Image from "next/image";
import { Heart, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Song {
    id: number | string;
    title: string;
    composer: string;
    image: string;
    duration: number;
}

interface FavSongsProps {
    songs: Song[];
    onSelect: (song: Song) => void;
}

export default function FavSongs({ songs, onSelect }: FavSongsProps) {
    return (
        <div className="lg:col-span-4 flex flex-col h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Liked Songs <Heart size={18} className="text-red-500 fill-red-500" />
            </h2>

            <div className="flex-1 bg-white/5 rounded-[2rem] p-4 overflow-hidden flex flex-col">
                {songs.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
                        <Heart size={40} className="opacity-20" />
                        <p className="text-sm">No liked songs yet</p>
                    </div>
                ) : (
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {songs.map((song, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => onSelect(song)}
                                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/10 transition cursor-pointer group"
                                >
                                    <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                        <Image src={song.image} alt={song.title} fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <Play size={12} fill="white" className="text-white" />
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-bold text-sm truncate text-white group-hover:text-[#C45EFF] transition">{song.title}</h4>
                                        <p className="text-[10px] text-gray-400 truncate">{song.composer}</p>
                                    </div>
                                    <Heart size={14} className="text-red-500 fill-red-500 shrink-0" />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
