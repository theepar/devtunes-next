"use client";

import React, { useState, useRef, useEffect } from "react";
import libraryData from '@/../public/library.json';

// Components
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import PlaylistGrid from "@/components/PlaylistGrid";
import RecentPlayed from "@/components/RecentPlayed";
import FavArtists from "@/components/FavArtists";
import Player from "@/components/Player";

// --- Mock Data ---
const PLAYLISTS = [
  { id: 1, title: "Best 80s Songs", count: "173 songs", image: "/images/code.jpg", color: "from-purple-600 to-blue-600" },
  { id: 2, title: "Old School", count: "41 songs", image: "/images/drive.jpg", color: "from-yellow-400 to-orange-500" },
  { id: 3, title: "Hesam's Top", count: "312 songs", image: "/images/gym.jpg", color: "from-pink-500 to-rose-500" },
];

const FAV_ARTISTS = [
  { id: 1, name: "Sia", count: "34 songs", image: "/images/lofi.jpg" },
  { id: 2, name: "The Weeknd", count: "29 songs", image: "/images/drive.jpg" },
  { id: 3, name: "Lana Del Rey", count: "12 songs", image: "/images/code.jpg" },
];

// Default music fallback
const DEFAULT_MUSIC = [
  {
    id: 1,
    title: "Dark Paradise",
    composer: "Lana Del Rey",
    image: "/images/code.jpg",
    file: "/music/Nightcore - Beautiful Creatures.mp3",
    duration: 243
  }
];

const MUSIC_LIST = libraryData.length > 0 ? libraryData.slice(0, 8) : DEFAULT_MUSIC;

export default function DevTunesApp() {
  // --- STATE ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- LOGIC ---
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleSelectSong = (index: number) => {
    setActiveIndex(index);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Improved Seek Handler (Fix Hitbox & Precision)
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation(); // Prevent bubbling

    if (audioRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      // Calculate X relative to the waveform container ONLY
      const x = e.clientX - rect.left;
      const width = rect.width;

      const seekTime = Math.max(0, Math.min((x / width) * duration, duration));

      audioRef.current.currentTime = seekTime;
      setCurrentTime(seekTime);
    }
  };

  const currentSong = MUSIC_LIST[activeIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.file;
      audioRef.current.load();
      if (isPlaying) audioRef.current.play().catch(e => console.error("Play error:", e));
    }
  }, [activeIndex]);

  const handleSongEnd = () => {
    setActiveIndex((prev) => (prev + 1) % MUSIC_LIST.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % MUSIC_LIST.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + MUSIC_LIST.length) % MUSIC_LIST.length);
  };

  return (
    <div className="flex h-screen bg-[#0D0714] text-white font-sans selection:bg-[#C45EFF] selection:text-white overflow-hidden relative">

      {/* --- BACKGROUND BLOBS --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
      </div>

      {/* ================= SIDEBAR (Left) ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT (Right) ================= */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">

        {/* --- HEADER --- */}
        <Header />

        {/* --- DASHBOARD SCROLL AREA --- */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 pb-32 scrollbar-hide">

          {/* 1. PLAYLISTS & BANNER GRID */}
          <PlaylistGrid playlists={PLAYLISTS} />

          {/* 2. RECENTLY PLAYED & ARTISTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Recently Played List (Col 8) */}
            <RecentPlayed
              songs={MUSIC_LIST}
              activeIndex={activeIndex}
              isPlaying={isPlaying}
              onSelect={handleSelectSong}
            />

            {/* Fav Artists (Col 4) */}
            <FavArtists artists={FAV_ARTISTS} />
          </div>

        </div>

      </main>

      {/* ================= PLAYER ================= */}
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        audioRef={audioRef}
        togglePlay={togglePlay}
        onTimeUpdate={onTimeUpdate}
        handleSongEnd={handleSongEnd}
        handleSeek={handleSeek}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes pulse-height {
            0% { transform: scaleY(1); opacity: 0.8; }
            100% { transform: scaleY(1.3); opacity: 1; }
        }
      `}</style>

    </div>
  );
}