import React from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Star, BarChart3, Shuffle, Heart, Mic2 } from "lucide-react";
import { motion } from "framer-motion";

interface PlayerProps {
    currentSong: {
        id: number | string;
        title: string;
        composer: string;
        image: string;
    };
    isPlaying: boolean;
    isLiked: boolean;
    isShuffle: boolean;
    showLyrics: boolean;
    currentTime: number;
    duration: number;
    audioRef: React.RefObject<HTMLAudioElement | null>;
    togglePlay: () => void;
    toggleLike: () => void;
    toggleShuffle: () => void;
    toggleLyrics: () => void;
    onTimeUpdate: () => void;
    handleSongEnd: () => void;
    handleSeek: (e: React.MouseEvent<HTMLDivElement>) => void;
    onNext: () => void;
    onPrev: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function Player({
    currentSong,
    isPlaying,
    isLiked,
    isShuffle,
    showLyrics,
    currentTime,
    duration,
    audioRef,
    togglePlay,
    toggleLike,
    toggleShuffle,
    toggleLyrics,
    onTimeUpdate,
    handleSongEnd,
    handleSeek,
    onNext,
    onPrev
}: PlayerProps) {
    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed bottom-6 left-4 right-4 md:left-8 md:right-8 z-50"
        >
            <div className="w-full h-[80px] bg-[#100C18]/90 backdrop-blur-3xl border border-white/5 rounded-[24px] px-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] flex items-center relative overflow-hidden group">

                {/* Invisible Audio Element */}
                <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={handleSongEnd} />

                {/* 1. LEFT: ART & INFO (Landscape 2:1) */}
                <div className="flex items-center gap-4 w-[260px] shrink-0">
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shadow-lg border border-white/5">
                        <Image src={currentSong.image} alt={currentSong.title} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-white font-bold text-[14px] truncate leading-tight">{currentSong.title}</h4>
                        <p className="text-gray-400 text-[11px] truncate">{currentSong.composer}</p>
                    </div>
                    <button onClick={toggleLike} className="ml-2 hover:scale-110 transition">
                        <Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-white"} />
                    </button>
                </div>

                {/* 2. CENTER: CONTROLS + WAVEFORM (THE STAR SHOW) */}
                <div className="flex-1 flex items-center gap-6 justify-center">

                    {/* A. Controls Group (Left side of waveform) */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button onClick={onPrev} className="text-white hover:text-purple-300 transition">
                            <SkipBack size={20} fill="currentColor" />
                        </button>

                        <button
                            onClick={togglePlay}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#D946EF] to-[#8B5CF6] shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:scale-105 transition-all"
                        >
                            {isPlaying ? <Pause size={18} fill="white" className="text-white" /> : <Play size={18} fill="white" className="text-white ml-1" />}
                        </button>

                        <button onClick={onNext} className="text-white hover:text-purple-300 transition">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                    </div>

                    {/* B. Waveform Visualizer & Time */}
                    <div className="flex items-center gap-4 w-full max-w-xl cursor-default">
                        <span className="text-[11px] font-medium text-white/80 w-8 text-right font-mono">{formatTime(currentTime)}</span>

                        {/* The Waveform - CLICKABLE AREA ONLY */}
                        <div
                            className="flex-1 h-10 flex items-center gap-[3px] justify-between opacity-90 cursor-pointer group/seek"
                            onClick={handleSeek}
                        >
                            {Array.from({ length: 50 }).map((_, i) => {
                                const progress = (currentTime / (duration || 1)) * 100;
                                const isActive = (i / 50) * 100 < progress;
                                // Random heights to simulate audio wave
                                const heightPercent = [30, 50, 70, 40, 80, 50, 90, 40, 60, 30, 50, 80, 40, 70, 30][i % 15];

                                return (
                                    <div
                                        key={i}
                                        className={`w-[3px] rounded-full transition-all duration-300 flex-1 min-w-[2px] ${isActive
                                            ? 'bg-gradient-to-t from-[#8B5CF6] to-[#F472B6] shadow-[0_0_5px_rgba(244,114,182,0.5)]'
                                            : 'bg-white/10'
                                            }`}
                                        style={{
                                            height: `${heightPercent}%`,
                                            animation: isPlaying && isActive ? 'pulse-height 0.6s infinite alternate' : 'none',
                                            animationDelay: `${i * 0.05}s`
                                        }}
                                    />
                                )
                            })}
                        </div>

                        <span className="text-[11px] font-medium text-gray-500 w-8 font-mono">{formatTime(duration)}</span>
                    </div>
                </div>

                {/* 3. RIGHT: EXTRAS */}
                <div className="hidden md:flex items-center gap-5 shrink-0 w-[180px] justify-end">
                    <button onClick={toggleLyrics} className="hover:scale-110 transition">
                        <Mic2 size={18} className={showLyrics ? "text-[#C45EFF]" : "text-gray-400 hover:text-white"} />
                    </button>
                    <button onClick={toggleShuffle} className="hover:scale-110 transition">
                        <Shuffle size={18} className={isShuffle ? "text-[#C45EFF]" : "text-gray-400 hover:text-white"} />
                    </button>
                    <BarChart3 size={18} className="text-gray-400 hover:text-white cursor-pointer" />
                </div>

            </div>
        </motion.div>
    );
}
