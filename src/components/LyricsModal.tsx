import React, { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { X, Mic2, Languages, Loader2, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { translateLyrics } from "@/app/actions";

interface LyricsModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentSong: {
        title: string;
        composer: string;
        image: string;
        duration?: number;
    };
    lyrics: string[];
    syncedLyrics?: { start: number; text: string }[] | null;
    currentTime: number;
}

const SUPPORTED_LANGUAGES = [
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { code: 'ru', label: 'Russian', flag: '🇷🇺' },
];

export default function LyricsModal({ isOpen, onClose, currentSong, lyrics, syncedLyrics, currentTime }: LyricsModalProps) {
    // Filter lyrics: Skip the first line as requested by user (often contains metadata/title)
    const filteredLyrics = useMemo(() => {
        if (syncedLyrics && syncedLyrics.length > 0) {
            return syncedLyrics.map(l => l.text);
        }
        if (!lyrics || lyrics.length === 0) return [];
        if (lyrics.length === 1) return lyrics; // Keep if only 1 line
        return lyrics.slice(1);
    }, [lyrics, syncedLyrics]);

    const [activeLineIndex, setActiveLineIndex] = useState(0);
    const [translatedLyrics, setTranslatedLyrics] = useState<string[] | null>(null);
    const [isTranslating, setIsTranslating] = useState(false);
    const [showTranslated, setShowTranslated] = useState(false);
    const [targetLang, setTargetLang] = useState('id');
    const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const lineRefs = useRef<(HTMLParagraphElement | null)[]>([]);

    // Reset state when song changes
    useEffect(() => {
        setTranslatedLyrics(null);
        setShowTranslated(false);
        setActiveLineIndex(0);
        setIsLangMenuOpen(false);
    }, [currentSong.title]);

    // Calculate Active Line
    useEffect(() => {
        // 1. PRECISE SYNC (If timestamps available)
        if (syncedLyrics && syncedLyrics.length > 0) {
            // Find the last line that has started
            const index = syncedLyrics.findIndex((line, i) => {
                const nextLine = syncedLyrics[i + 1];
                if (nextLine) {
                    return currentTime >= line.start && currentTime < nextLine.start;
                }
                return currentTime >= line.start; // Last line
            });

            if (index !== -1) {
                setActiveLineIndex(index);
            }
            return;
        }

        // 2. ESTIMATION LOGIC (Smart Vocal Range) - Fallback
        if (!filteredLyrics || filteredLyrics.length === 0) return;

        const duration = currentSong.duration || 180;

        // Estimate Intro: 10% of song, capped at 18 seconds (Average pop song intro)
        const introDuration = Math.min(duration * 0.1, 18);

        // Estimate Outro: 5% of song, capped at 15 seconds
        const outroDuration = Math.min(duration * 0.05, 15);

        const vocalDuration = duration - introDuration - outroDuration;

        let progress = 0;

        if (currentTime < introDuration) {
            // Still in Intro -> Stay at line 0
            progress = 0;
        } else if (currentTime > (duration - outroDuration)) {
            // In Outro -> Go to last line
            progress = 1;
        } else {
            // Inside Vocal Range -> Linear mapping
            progress = (currentTime - introDuration) / vocalDuration;
        }

        // Map progress to line index
        // We use Math.floor to keep it steady
        const rawIndex = Math.floor(progress * filteredLyrics.length);

        // User reported it's too fast by 1-2 lines.
        // We shift it back by 1 line to delay it slightly.
        const adjustedIndex = Math.max(0, rawIndex - 1);

        setActiveLineIndex(Math.min(adjustedIndex, filteredLyrics.length - 1));
    }, [currentTime, currentSong.duration, filteredLyrics, syncedLyrics]);

    // Auto-scroll to active line
    useEffect(() => {
        if (activeLineIndex >= 0 && lineRefs.current[activeLineIndex]) {
            lineRefs.current[activeLineIndex]?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [activeLineIndex]);

    // Handle Translate
    const handleTranslate = async (langCode?: string) => {
        const langToUse = langCode || targetLang;

        // If switching language, always translate
        if (langCode && langCode !== targetLang) {
            setTargetLang(langCode);
            // Continue to translate below...
        } else {
            // If toggling same language
            if (showTranslated) {
                setShowTranslated(false);
                return;
            }
            // If already translated to this lang, just show it
            if (translatedLyrics && targetLang === langToUse) {
                setShowTranslated(true);
                return;
            }
        }

        setIsTranslating(true);
        setIsLangMenuOpen(false); // Close menu if open

        // Translate the filtered lyrics
        const res = await translateLyrics(filteredLyrics, langToUse);
        setIsTranslating(false);

        if (res.success && res.data) {
            setTranslatedLyrics(res.data);
            setShowTranslated(true);
            setTargetLang(langToUse);
        } else {
            alert("Failed to translate lyrics. Please try again.");
        }
    };

    const currentLyrics = showTranslated && translatedLyrics ? translatedLyrics : filteredLyrics;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: "100%" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: "100%" }}
                    transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }} // iOS style ease
                    className="fixed inset-0 z-[100] bg-[#0D0714]/95 backdrop-blur-3xl flex flex-col overflow-hidden"
                >
                    {/* Background Gradient Mesh */}
                    <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
                        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-purple-600/30 rounded-full blur-[150px]" />
                        <div className="absolute bottom-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-blue-600/30 rounded-full blur-[150px]" />
                    </div>

                    {/* Header (Sticky/Absolute Top) */}
                    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-6 bg-gradient-to-b from-[#0D0714] via-[#0D0714]/80 to-transparent">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/10">
                                <Mic2 size={24} className="text-[#C45EFF]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Karaoke Mode</h2>
                                <p className="text-sm text-white/50 font-medium">Apple Style Lyrics</p>
                            </div>
                        </div>
                        <div className="flex gap-4 relative">

                            {/* Translate Button Group */}
                            <div className="flex items-center bg-white/5 rounded-full border border-white/10 overflow-hidden">
                                <button
                                    onClick={() => handleTranslate()}
                                    disabled={isTranslating}
                                    className={`flex items-center gap-2 px-4 py-3 transition-all ${showTranslated ? 'bg-[#C45EFF] text-white' : 'hover:bg-white/10 text-gray-300 hover:text-white'}`}
                                >
                                    {isTranslating ? <Loader2 size={18} className="animate-spin" /> : <Languages size={18} />}
                                    <span className="font-medium text-sm hidden md:inline">
                                        {showTranslated ? SUPPORTED_LANGUAGES.find(l => l.code === targetLang)?.label : 'Translate'}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                                    className={`p-3 border-l border-white/10 transition-all ${isLangMenuOpen ? 'bg-white/10 text-white' : 'hover:bg-white/10 text-gray-300'}`}
                                >
                                    <ChevronDown size={18} />
                                </button>
                            </div>

                            {/* Language Dropdown */}
                            <AnimatePresence>
                                {isLangMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full right-[60px] mt-2 w-48 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                                    >
                                        {SUPPORTED_LANGUAGES.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => handleTranslate(lang.code)}
                                                className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/5 text-sm transition-colors"
                                            >
                                                <span className="text-gray-200 flex items-center gap-2">
                                                    <span>{lang.flag}</span> {lang.label}
                                                </span>
                                                {targetLang === lang.code && <Check size={16} className="text-[#C45EFF]" />}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button onClick={onClose} className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition border border-white/10">
                                <X size={24} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-12 pb-24 pt-32 overflow-hidden">

                        {/* Left: Album Art (No staggered delay) */}
                        <div className="hidden lg:block w-[450px] aspect-square relative rounded-[2.5rem] overflow-hidden shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5)] border border-white/10 group shrink-0">
                            <Image src={currentSong.image} alt={currentSong.title} fill className="object-cover transition-transform duration-[3s] group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8">
                                <h1 className="text-3xl font-bold text-white mb-2 line-clamp-2 leading-tight">{currentSong.title}</h1>
                                <p className="text-xl text-[#C45EFF] font-medium">{currentSong.composer}</p>
                            </div>
                        </div>

                        {/* Right: Lyrics Scroll Area */}
                        <div className="flex-1 h-full max-w-3xl flex flex-col relative">

                            {/* Mobile Header (Only visible on small screens) */}
                            <div className="lg:hidden text-center mb-8">
                                <h1 className="text-2xl font-bold text-white mb-1">{currentSong.title}</h1>
                                <p className="text-sm text-[#C45EFF]">{currentSong.composer}</p>
                            </div>

                            <div
                                ref={scrollRef}
                                className="flex-1 overflow-y-auto custom-scrollbar pr-4 text-center md:text-left mask-image-gradient py-[50vh]"
                            >
                                {currentLyrics && currentLyrics.length > 0 ? (
                                    currentLyrics.map((line, idx) => {
                                        const isActive = idx === activeLineIndex;
                                        // Distance from active line for blur effect
                                        const distance = Math.abs(idx - activeLineIndex);
                                        const blurAmount = isActive ? 0 : Math.min(distance * 1.5, 6);
                                        const opacity = isActive ? 1 : Math.max(0.3, 1 - distance * 0.2);
                                        const scale = isActive ? 1.1 : 0.95;

                                        return (
                                            <motion.p
                                                key={idx}
                                                ref={(el) => { lineRefs.current[idx] = el }}
                                                animate={{
                                                    opacity: opacity,
                                                    scale: scale,
                                                    filter: `blur(${blurAmount}px)`,
                                                    color: isActive ? "#FFFFFF" : "#A0A0A0"
                                                }}
                                                transition={{ duration: 0.4 }}
                                                className={`text-3xl md:text-4xl font-bold mb-8 transition-all cursor-pointer leading-tight origin-left ${isActive ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]' : ''}`}
                                                onClick={() => setActiveLineIndex(idx)} // Allow manual sync adjustment
                                            >
                                                {line}
                                            </motion.p>
                                        );
                                    })
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-6">
                                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center animate-pulse">
                                            <Mic2 size={40} className="opacity-30" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-white/50 mb-2">Lyrics not available</p>
                                            <p className="text-sm text-white/30">Try playing another song or downloading lyrics.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <style jsx>{`
            .mask-image-gradient {
                mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
            }
            /* Hide scrollbar but keep functionality */
            .custom-scrollbar::-webkit-scrollbar {
                width: 0px;
                background: transparent;
            }
          `}</style>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
