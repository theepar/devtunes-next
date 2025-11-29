import React from "react";
import Image from "next/image";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Heart, Mic2 } from "lucide-react";
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
            className="fixed bottom-4 left-2 right-2 md:bottom-6 md:left-4 md:right-4 lg:left-8 lg:right-8 z-50"
        >
            <div className="w-full h-[72px] md:h-[78px] lg:h-[80px] bg-[#100C18]/90 backdrop-blur-3xl border border-white/5 rounded-[20px] md:rounded-[22px] lg:rounded-[24px] px-3 md:px-5 lg:px-6 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] flex items-center justify-between gap-2 md:gap-3 lg:gap-6 relative overflow-hidden group">

                {/* Invisible Audio Element */}
                <audio ref={audioRef} onTimeUpdate={onTimeUpdate} onEnded={handleSongEnd} />

                {/* ============ MOBILE/TABLET LAYOUT ============ */}
                <div className="flex lg:hidden items-center justify-between gap-2 md:gap-3 w-full">
                    {/* LEFT: ART & INFO */}
                    <div className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0 flex-1">
                        <div className="relative w-11 h-11 md:w-14 md:h-11 rounded-lg overflow-hidden shadow-lg border border-white/5 shrink-0">
                            <Image src={currentSong.image} alt={currentSong.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <h4 className="text-white font-bold text-xs md:text-[13px] truncate leading-tight">{currentSong.title}</h4>
                            <p className="text-gray-400 text-[10px] truncate">{currentSong.composer}</p>
                        </div>
                    </div>

                    {/* CENTER: CONTROLS + ICONS */}
                    <div className="flex items-center gap-3 md:gap-4 shrink-0">
                        {/* Like + Shuffle */}
                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                            <button onClick={toggleLike} className="hover:scale-110 active:scale-95 transition p-1.5 rounded-lg hover:bg-white/5">
                                <Heart size={18} className="md:w-5 md:h-5" fill={isLiked ? "currentColor" : "none"} strokeWidth={2} color={isLiked ? "#ef4444" : "#9ca3af"} />
                            </button>
                            <button onClick={toggleShuffle} className="hover:scale-110 active:scale-95 transition p-1.5 rounded-lg hover:bg-white/5">
                                <Shuffle size={18} className="md:w-5 md:h-5" strokeWidth={2} color={isShuffle ? "#C45EFF" : "#9ca3af"} />
                            </button>
                        </div>

                        {/* Playback Controls */}
                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                            <button onClick={onPrev} className="text-white hover:text-purple-300 active:scale-95 transition p-1.5 rounded-lg hover:bg-white/5">
                                <SkipBack size={18} className="md:w-5 md:h-5" fill="currentColor" />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#D946EF] to-[#8B5CF6] shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:scale-105 active:scale-95 transition-all"
                            >
                                {isPlaying ? <Pause size={18} className="md:w-5 md:h-5 text-white" fill="white" /> : <Play size={18} className="md:w-5 md:h-5 text-white ml-0.5" fill="white" />}
                            </button>

                            <button onClick={onNext} className="text-white hover:text-purple-300 active:scale-95 transition p-1.5 rounded-lg hover:bg-white/5">
                                <SkipForward size={18} className="md:w-5 md:h-5" fill="currentColor" />
                            </button>
                        </div>

                        {/* Lyrics */}
                        <button onClick={toggleLyrics} className="hover:scale-110 active:scale-95 transition p-1.5 rounded-lg hover:bg-white/5 shrink-0">
                            <Mic2 size={15} className="md:w-[17px] md:h-[17px]" strokeWidth={2} color={showLyrics ? "#C45EFF" : "#9ca3af"} />
                        </button>
                    </div>
                </div>

                {/* ============ DESKTOP LAYOUT (3 SECTIONS) ============ */}
                <div className="hidden lg:flex items-center justify-between gap-4 w-full">

                    {/* SECTION 1: LEFT - ART + INFO + LIKE */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shadow-lg border border-white/5 shrink-0">
                            <Image src={currentSong.image} alt={currentSong.title} fill className="object-cover" />
                        </div>
                        <div className="min-w-0 flex-1 max-w-[200px]">
                            <h4 className="text-white font-bold text-[14px] leading-tight line-clamp-1">{currentSong.title}</h4>
                            <p className="text-gray-400 text-[11px] truncate">{currentSong.composer}</p>
                        </div>
                        <button onClick={toggleLike} className="hover:scale-110 transition shrink-0">
                            <Heart size={18} className={isLiked ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-white"} />
                        </button>
                    </div>

                    {/* SECTION 2: CENTER - CONTROLS (LEFT) + WAVEFORM (RIGHT) */}
                    <div className="flex items-center gap-4 w-[450px] shrink-0 justify-center">
                        {/* Playback Controls */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button onClick={onPrev} className="text-white hover:text-purple-300 transition">
                                <SkipBack size={18} fill="currentColor" />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#D946EF] to-[#8B5CF6] shadow-[0_0_15px_rgba(217,70,239,0.5)] hover:scale-105 transition-all"
                            >
                                {isPlaying ? <Pause size={18} fill="white" className="text-white" /> : <Play size={18} fill="white" className="text-white ml-0.5" />}
                            </button>

                            <button onClick={onNext} className="text-white hover:text-purple-300 transition">
                                <SkipForward size={18} fill="currentColor" />
                            </button>
                        </div>

                        {/* Waveform + Time */}
                        <div className="flex items-center gap-2 flex-1">
                            <span className="text-[10px] font-medium text-white/80 w-8 text-right font-mono">{formatTime(currentTime)}</span>

                            <div
                                className="flex-1 h-8 flex items-center gap-[2px] justify-between opacity-90 cursor-pointer group/seek"
                                onClick={handleSeek}
                            >
                                {Array.from({ length: 35 }).map((_, i) => {
                                    const progress = (currentTime / (duration || 1)) * 100;
                                    const isActive = (i / 35) * 100 < progress;
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

                            <span className="text-[10px] font-medium text-gray-500 w-8 font-mono">{formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* SECTION 3: RIGHT - LYRICS + SHUFFLE */}
                    <div className="flex items-center gap-4 flex-1 justify-end min-w-0">
                        <button onClick={toggleLyrics} className="hover:scale-110 transition">
                            <Mic2 size={18} className={showLyrics ? "text-[#C45EFF]" : "text-gray-400 hover:text-white"} />
                        </button>
                        <button onClick={toggleShuffle} className="hover:scale-110 transition">
                            <Shuffle size={18} className={isShuffle ? "text-[#C45EFF]" : "text-gray-400 hover:text-white"} />
                        </button>
                    </div>

                </div>

            </div>
        </motion.div>
    );
}
