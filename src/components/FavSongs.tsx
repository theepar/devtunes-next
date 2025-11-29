import React from "react";
import Image from "next/image";
import { Heart, Play } from "lucide-react";
import { motion, AnimatePresence, Variants } from "framer-motion";

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
    onUnlike: (id: number | string) => void;
}

export default function FavSongs({ songs, onSelect, onUnlike }: FavSongsProps) {
    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.5 },
        show: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.3, ease: "easeOut" }
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            transition: { duration: 0.3, ease: "easeIn" }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="lg:col-span-4 flex flex-col h-full"
        >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                Liked Songs <Heart size={18} className="text-red-500 fill-red-500" />
            </h2>

            <div className="flex-1 bg-white/5 rounded-[2rem] p-4 overflow-hidden flex flex-col border border-white/5 shadow-xl backdrop-blur-sm relative h-[280px] md:h-[380px] lg:h-auto lg:min-h-[400px]">
                <AnimatePresence>
                    {songs.length === 0 && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 gap-2 z-0"
                        >
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Heart size={40} />
                            </motion.div>
                            <p className="text-sm">No liked songs yet</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar relative z-10 h-full">
                    <AnimatePresence>
                        {songs.map((song) => (
                            <motion.div
                                key={song.id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="show"
                                exit="exit"
                                onClick={() => onSelect(song)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group border border-transparent hover:border-white/5"
                            >
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 shadow-md">
                                    <Image src={song.image} alt={song.title} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                        <Play size={12} fill="white" className="text-white" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-sm truncate text-white group-hover:text-[#C45EFF] transition">{song.title}</h4>
                                    <p className="text-[10px] text-gray-400 truncate">{song.composer}</p>
                                </div>
                                <motion.div
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.8 }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUnlike(song.id);
                                    }}
                                    className="p-1"
                                >
                                    <Heart size={14} className="text-red-500 fill-red-500 shrink-0" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
}
