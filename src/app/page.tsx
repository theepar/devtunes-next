"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play, Pause, SkipBack, SkipForward,
  Home, Disc, LayoutDashboard, Volume2,
  Search, Heart, Shuffle, Repeat, Music
} from "lucide-react";

// --- Swiper Imports ---
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Mousewheel, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";

// --- Mock Data ---
const PLAYLISTS = [
  { id: 1, title: "Coding Mode", image: "/images/code.jpg", desc: "Deep Focus" },
  { id: 2, title: "Night Drive", image: "/images/drive.jpg", desc: "Chill Vibes" },
  { id: 3, title: "Gym Motivation", image: "/images/gym.jpg", desc: "Power Up" },
  { id: 4, title: "Lofi Study", image: "/images/lofi.jpg", desc: "Relaxing Beats" },
];

const MUSIC_LIST = [
  { id: 1, title: "Beautiful Creatures", composer: "Nightcore", image: "/images/code.jpg", file: "/music/Nightcore - Beautiful Creatures.mp3", duration: 213 },
  { id: 2, title: "Lost Control", composer: "Nightcore", image: "/images/gym.jpg", file: "/music/Nightcore - Lost Control.mp3", duration: 240 },
  { id: 3, title: "Beautiful Creatures (Remix)", composer: "Nightcore", image: "/images/drive.jpg", file: "/music/Nightcore - Beautiful Creatures.mp3", duration: 185 },
  { id: 4, title: "Lost Control (Vibe)", composer: "Nightcore", image: "/images/lofi.jpg", file: "/music/Nightcore - Lost Control.mp3", duration: 190 },
  { id: 5, title: "Beautiful Creatures (Chill)", composer: "Nightcore", image: "/images/drive.jpg", file: "/music/Nightcore - Beautiful Creatures.mp3", duration: 205 },
];

// --- Utilities ---
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default function DevTunesApp() {
  // --- STATE MANAGEMENT ---
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const swiperRef = useRef<any>(null);

  // --- LOGIC ---

  // 1. Handle Slide Change (Update Song)
  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
    // Reset progress saat ganti lagu via slide
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // 2. Handle Play/Pause Global
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 3. Handle Select specific song from Swiper
  const handleSelectSong = (index: number) => {
    if (index !== activeIndex) {
      swiperRef.current?.swiper.slideTo(index);
    } else {
      togglePlay();
    }
  };

  // 4. Update Time Progress
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // 5. Update Source when activeIndex changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = MUSIC_LIST[activeIndex].file;
      audioRef.current.load();
      // Auto play jika user sudah dalam mode play, opsional:
      // if (isPlaying) audioRef.current.play();
    }
  }, [activeIndex]);

  // 6. Handle Volume Change
  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const newVolume = e.nativeEvent.offsetX / e.currentTarget.offsetWidth;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    if (audioRef.current) {
      audioRef.current.volume = clampedVolume;
    }
  };

  // Sync volume on mount/change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const currentSong = MUSIC_LIST[activeIndex];

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-[#C45EFF] selection:text-white flex flex-col">

      {/* ================= NAVBAR ================= */}
      <nav className="fixed top-0 w-full z-50 bg-[#121212]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#C45EFF] to-purple-800 rounded-lg flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Music size={18} fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight">DevTunes</span>
          </Link>

          {/* Center Links */}
          <div className="hidden md:flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/5">
            {[
              { name: 'Home', icon: Home, href: '/' },
              { name: 'Playlist', icon: Disc, href: '/playlist' },
              { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' }
            ].map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${link.name === 'Home'
                    ? 'bg-[#C45EFF] text-white shadow-[0_0_15px_rgba(196,94,255,0.4)]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                <link.icon size={16} />
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center bg-neutral-800 rounded-full px-4 py-2 border border-white/5 focus-within:border-[#C45EFF]/50 transition-colors">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-32 text-white placeholder-gray-500" />
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 p-[2px]">
              <div className="w-full h-full rounded-full bg-[#121212] flex items-center justify-center">
                <span className="font-bold text-xs">US</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 container mx-auto px-4 pt-28 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">

          {/* --- LEFT: Hero Text & Grid --- */}
          <div className="flex flex-col justify-center space-y-8">
            <div className="space-y-4 animate-in fade-in slide-in-from-left duration-700">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Welcome to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C45EFF] to-pink-500">
                  Sound of Harmony
                </span>
              </h1>
              <p className="text-gray-400 text-lg max-w-lg">
                Dive into a world where melodies paint emotions. Curated playlists for every coding session.
              </p>
            </div>

            {/* Mini Playlist Grid */}
            <div className="grid grid-cols-2 gap-4">
              {PLAYLISTS.map((item) => (
                <div key={item.id} className="group relative bg-[#1A1A1A] p-3 rounded-xl hover:bg-[#252525] transition-all duration-300 border border-white/5 hover:border-[#C45EFF]/30 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-sm truncate group-hover:text-[#C45EFF] transition-colors">{item.title}</h4>
                      <p className="text-xs text-gray-500 truncate">{item.desc}</p>
                    </div>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-[#C45EFF] rounded-full p-1.5 shadow-lg">
                        <Play size={10} fill="black" className="text-black ml-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: 3D Swiper --- */}
          <div className="relative h-[500px] flex items-center justify-center">

            {/* Dynamic Ambient Background */}
            <div className="absolute inset-0 z-0">
              <Image
                key={currentSong.image}
                src={currentSong.image}
                alt="Ambient"
                fill
                className="object-cover blur-[80px] opacity-30 animate-pulse"
              />
            </div>

            <div className="w-full max-w-sm h-full z-10 py-10">
              <Swiper
                ref={swiperRef}
                effect={'coverflow'}
                grabCursor={true}
                centeredSlides={true}
                slidesPerView={'auto'}
                direction={'vertical'}
                mousewheel={true}
                initialSlide={1}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 20,
                  depth: 150,
                  modifier: 1,
                  slideShadows: false,
                }}
                onSlideChange={handleSlideChange}
                modules={[EffectCoverflow, Mousewheel]}
                className="h-full w-full !overflow-visible"
              >
                {MUSIC_LIST.map((item, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <SwiperSlide key={item.id} className="!h-[100px] !w-full flex justify-center items-center transition-all duration-300">
                      <div
                        onClick={() => handleSelectSong(index)}
                        className={`
                          relative w-full h-[80px] rounded-xl p-2 flex items-center gap-4 transition-all duration-500 cursor-pointer border
                          ${isActive
                            ? 'bg-white/10 backdrop-blur-md border-[#C45EFF]/50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] scale-110 z-50'
                            : 'bg-black/40 border-white/5 opacity-40 scale-95 hover:opacity-70'
                          }
                        `}
                      >
                        <div className={`relative h-16 w-16 shrink-0 rounded-lg overflow-hidden ${isActive ? 'shadow-lg ring-1 ring-[#C45EFF]' : ''}`}>
                          <Image src={item.image} alt={item.title} fill className="object-cover" />
                          {/* Playing Indicator Overlay */}
                          {isActive && isPlaying && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="flex gap-0.5 items-end h-4 pb-1">
                                <span className="w-1 bg-[#C45EFF] animate-[bounce_1s_infinite] h-full rounded-full"></span>
                                <span className="w-1 bg-white animate-[bounce_1.2s_infinite] h-2/3 rounded-full"></span>
                                <span className="w-1 bg-[#C45EFF] animate-[bounce_0.8s_infinite] h-full rounded-full"></span>
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className={`font-bold truncate ${isActive ? 'text-white' : 'text-gray-400'}`}>{item.title}</h3>
                          <p className="text-xs text-[#C45EFF] truncate">{item.composer}</p>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        </div>
      </main>

      {/* ================= PLAYER BAR (Garis Pemutar) ================= */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#0a0a0a]/90 backdrop-blur-xl border-t border-white/10 z-50 px-6 flex items-center justify-between shadow-[0_-5px_30px_rgba(0,0,0,0.8)]">

        {/* Hidden Audio */}
        <audio
          ref={audioRef}
          onTimeUpdate={onTimeUpdate}
          onEnded={() => setIsPlaying(false)}
        />

        {/* 1. Song Info */}
        <div className="flex items-center gap-4 w-[30%]">
          <div className={`relative h-14 w-14 rounded-full overflow-hidden shadow-lg ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : ''}`}>
            <Image src={currentSong.image} alt={currentSong.title} fill className="object-cover" />
          </div>
          <div className="hidden sm:block">
            <h4 className="font-bold text-sm text-white hover:underline cursor-pointer">{currentSong.title}</h4>
            <p className="text-xs text-gray-400">{currentSong.composer}</p>
          </div>
          <Heart size={18} className="text-gray-500 hover:text-[#C45EFF] cursor-pointer ml-2 hidden sm:block" />
        </div>

        {/* 2. Controls & Progress */}
        <div className="flex flex-col items-center justify-center w-[40%] gap-1">
          <div className="flex items-center gap-6">
            <Shuffle size={16} className="text-gray-500 hover:text-white cursor-pointer" />
            <SkipBack size={20} className="text-gray-300 hover:text-white cursor-pointer hover:scale-110 transition" onClick={() => swiperRef.current?.swiper.slidePrev()} />

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition shadow-lg shadow-white/10"
            >
              {isPlaying ? <Pause size={20} fill="black" className="text-black" /> : <Play size={20} fill="black" className="text-black ml-1" />}
            </button>

            <SkipForward size={20} className="text-gray-300 hover:text-white cursor-pointer hover:scale-110 transition" onClick={() => swiperRef.current?.swiper.slideNext()} />
            <Repeat size={16} className="text-gray-500 hover:text-white cursor-pointer" />
          </div>

          <div className="w-full flex items-center gap-3 text-xs text-gray-400 font-mono mt-1">
            <span>{formatTime(currentTime)}</span>
            <div className="relative h-1 flex-1 bg-gray-800 rounded-full cursor-pointer group">
              <div
                className="absolute top-0 left-0 h-full bg-[#C45EFF] rounded-full group-hover:bg-[#d48aff] transition-colors"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
              </div>
            </div>
            <span>{formatTime(duration || currentSong.duration || 0)}</span>
          </div>
        </div>

        {/* 3. Volume / Extra */}
        <div className="flex items-center justify-end w-[30%] gap-3">
          <Volume2 size={18} className="text-gray-400" />
          <div
            className="w-24 h-1 bg-gray-800 rounded-full overflow-hidden cursor-pointer"
            onClick={handleVolumeChange}
          >
            <div
              className="h-full bg-gray-400 rounded-full hover:bg-[#C45EFF] transition-colors"
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>

      </div>
    </div>
  );
}