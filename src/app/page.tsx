"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import libraryData from '@/../public/library.json';

// Components
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Headbar";
import PlaylistGrid from "@/components/Header";
import RecentPlayed from "@/components/RecentPlayed";
import FavSongs from "@/components/FavSongs";
import Player from "@/components/Player";
import LyricsModal from "@/components/LyricsModal";
import { useSettings } from "@/context/SettingsContext";

const MUSIC_LIST = libraryData.length > 0 ? libraryData.slice(0, 8) : [];

export default function DevTunesApp() {
  // --- STATE ---
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Settings
  const { performanceMode, crossfade } = useSettings();

  // Liked Songs State
  const [likedSongIds, setLikedSongIds] = useState<any[]>([]);
  const [isShuffle, setIsShuffle] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [lyricsLines, setLyricsLines] = useState<string[]>([]);
  const [syncedLyrics, setSyncedLyrics] = useState<any[] | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- LOGIC ---
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        // Fade out if crossfade is enabled
        if (crossfade > 0) {
          const fadeOut = setInterval(() => {
            if (audioRef.current && audioRef.current.volume > 0.1) {
              audioRef.current.volume -= 0.1;
            } else {
              clearInterval(fadeOut);
              if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.volume = 1; // Reset for next play
              }
              setIsPlaying(false);
            }
          }, 50);
        } else {
          audioRef.current.pause();
          setIsPlaying(!isPlaying);
        }
      } else {
        audioRef.current.play();
        setIsPlaying(!isPlaying);
      }
    }
  };

  const toggleShuffle = () => setIsShuffle(!isShuffle);
  const toggleLyrics = () => setShowLyrics(!showLyrics);

  // Helper to handle song change with crossfade
  const changeSong = (newIndex: number) => {
    if (crossfade > 0 && isPlaying && audioRef.current) {
      // Fade Out
      const fadeDuration = (crossfade * 1000) / 2; // Half time for out, half for in
      const stepTime = 50;
      const steps = fadeDuration / stepTime;
      const volStep = 1 / steps;

      let currentVol = 1;
      const fadeOutInterval = setInterval(() => {
        currentVol -= volStep;
        if (audioRef.current) {
          audioRef.current.volume = Math.max(0, currentVol);
        }

        if (currentVol <= 0) {
          clearInterval(fadeOutInterval);
          setActiveIndex(newIndex);
          setIsPlaying(true);
          // Volume will be faded in by the useEffect triggering on activeIndex change
        }
      }, stepTime);
    } else {
      setActiveIndex(newIndex);
      setIsPlaying(true);
    }
  };

  const handleSelectSong = (index: number) => {
    changeSong(index);
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

  // Toggle Like Function
  const toggleLike = () => {
    setLikedSongIds(prev => {
      if (prev.includes(currentSong.id)) {
        return prev.filter(id => id !== currentSong.id);
      } else {
        return [...prev, currentSong.id];
      }
    });
  };

  const isLiked = likedSongIds.includes(currentSong.id);

  // Get full song objects for liked songs
  const likedSongs = useMemo(() => MUSIC_LIST.filter(song => likedSongIds.includes(song.id)), [likedSongIds]);

  // Fetch Lyrics when song changes
  useEffect(() => {
    const fetchLyrics = async () => {
      setLyricsLines([]); // Reset
      setSyncedLyrics(null); // Reset

      const song = currentSong as any;
      if (song.lyrics) {
        try {
          const res = await fetch(song.lyrics);
          if (res.ok) {
            const data = await res.json();
            if (data.lyricsArray) {
              setLyricsLines(data.lyricsArray);
            }
            if (data.syncedLyrics) {
              setSyncedLyrics(data.syncedLyrics);
            }
          }
        } catch (err) {
          console.error("Failed to load lyrics:", err);
        }
      }
    };

    fetchLyrics();
  }, [currentSong]);

  // Handle Song Change & Fade In
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.file;
      audioRef.current.load();

      if (isPlaying) {
        if (crossfade > 0) {
          audioRef.current.volume = 0;
          audioRef.current.play().catch(e => console.error("Play error:", e));

          // Fade In
          const fadeDuration = (crossfade * 1000) / 2;
          const stepTime = 50;
          const steps = fadeDuration / stepTime;
          const volStep = 1 / steps;

          let currentVol = 0;
          const fadeInInterval = setInterval(() => {
            currentVol += volStep;
            if (audioRef.current) {
              audioRef.current.volume = Math.min(1, currentVol);
            }

            if (currentVol >= 1) {
              clearInterval(fadeInInterval);
            }
          }, stepTime);
        } else {
          audioRef.current.volume = 1;
          audioRef.current.play().catch(e => console.error("Play error:", e));
        }
      }
    }
  }, [activeIndex]);

  const handleSongEnd = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * MUSIC_LIST.length);
      changeSong(randomIndex);
    } else {
      changeSong((activeIndex + 1) % MUSIC_LIST.length);
    }
  };

  const handleNext = () => {
    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * MUSIC_LIST.length);
      changeSong(randomIndex);
    } else {
      changeSong((activeIndex + 1) % MUSIC_LIST.length);
    }
  };

  const handlePrev = () => {
    changeSong((activeIndex - 1 + MUSIC_LIST.length) % MUSIC_LIST.length);
  };

  // Handle Unlike from FavSongs
  const handleUnlike = (id: number | string) => {
    setLikedSongIds(prev => prev.filter(songId => songId !== Number(id)));
  };

  // Handle selecting a liked song
  const handleSelectLikedSong = (song: any) => {
    const index = MUSIC_LIST.findIndex(s => s.id === song.id);
    if (index !== -1) {
      changeSong(index);
    }
  };

  return (
    <div className="flex h-screen bg-[#0D0714] text-white font-sans selection:bg-[#C45EFF] selection:text-white overflow-hidden relative">

      {/* --- BACKGROUND BLOBS (Conditional) --- */}
      {!performanceMode && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
        </div>
      )}

      {/* ================= SIDEBAR (Left) ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT (Right) ================= */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">

        {/* --- HEADER --- */}
        <Header />

        {/* --- DASHBOARD SCROLL AREA --- */}
        <div className="flex-1 overflow-y-auto px-4 md:px-12 pb-32 scrollbar-hide">

          {/* 1. PLAYLISTS & BANNER GRID */}
          <PlaylistGrid />

          {/* 2. RECENTLY PLAYED & LIKED SONGS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Recently Played List (Col 8) */}
            <RecentPlayed
              songs={MUSIC_LIST}
              activeIndex={activeIndex}
              isPlaying={isPlaying}
              onSelect={(index) => {
                changeSong(index);
              }}
            />

            {/* Liked Songs (Col 4) */}
            <FavSongs
              songs={likedSongs}
              onSelect={handleSelectLikedSong}
              onUnlike={handleUnlike}
            />
          </div>

        </div>

      </main>

      {/* ================= LYRICS MODAL ================= */}
      <LyricsModal
        isOpen={showLyrics}
        onClose={() => setShowLyrics(false)}
        currentSong={currentSong}
        lyrics={lyricsLines}
        syncedLyrics={syncedLyrics}
        currentTime={currentTime}
      />

      {/* ================= PLAYER ================= */}
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        isLiked={isLiked}
        isShuffle={isShuffle}
        showLyrics={showLyrics}
        currentTime={currentTime}
        duration={duration}
        audioRef={audioRef}
        togglePlay={togglePlay}
        toggleLike={toggleLike}
        toggleShuffle={toggleShuffle}
        toggleLyrics={toggleLyrics}
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