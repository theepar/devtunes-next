"use client";

import React from "react";
import { motion } from "framer-motion";
import { Settings, Moon, Volume2, Zap, Trash2, ArrowLeft, Monitor, Speaker } from "lucide-react";
import Link from "next/link";
import { useSettings } from "@/context/SettingsContext";

export default function SettingsPage() {
    const {
        performanceMode, setPerformanceMode,
        spatialAudio, setSpatialAudio,
        crossfade, setCrossfade
    } = useSettings();

    const handleClearCache = () => {
        if (confirm("Are you sure you want to clear all app cache? This will reset your settings.")) {
            localStorage.clear();
            sessionStorage.clear();
            alert("Cache cleared successfully! The page will reload.");
            window.location.reload();
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0D0714] text-white font-sans selection:bg-[#C45EFF] selection:text-white overflow-x-hidden relative">

            {/* --- BACKGROUND BLOBS (Conditional) --- */}
            {!performanceMode && (
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" />
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
                </div>
            )}

            <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">

                {/* HEADER */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Player
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold flex items-center gap-4">
                        Settings <Settings className="text-[#C45EFF]" size={40} />
                    </h1>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="space-y-8"
                >

                    {/* SECTION: APPEARANCE */}
                    <motion.section variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                            <Monitor size={20} className="text-blue-400" /> Appearance
                        </h2>

                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-white">Performance Mode</h3>
                                    <p className="text-sm text-gray-400">Reduce background animations for better performance.</p>
                                </div>
                                <button
                                    onClick={() => setPerformanceMode(!performanceMode)}
                                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${performanceMode ? 'bg-[#C45EFF]' : 'bg-white/10'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${performanceMode ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>
                        </div>
                    </motion.section>

                    {/* SECTION: AUDIO */}
                    <motion.section variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                            <Speaker size={20} className="text-pink-400" /> Audio
                        </h2>

                        <div className="space-y-8">
                            {/* Spatial Audio */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="font-medium text-white">Spatial Audio</h3>
                                    <p className="text-sm text-gray-400">Simulate 3D surround sound experience.</p>
                                </div>
                                <button
                                    onClick={() => setSpatialAudio(!spatialAudio)}
                                    className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${spatialAudio ? 'bg-[#C45EFF]' : 'bg-white/10'}`}
                                >
                                    <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-300 ${spatialAudio ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {/* Crossfade Slider */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <h3 className="font-medium text-white">Crossfade</h3>
                                    <span className="text-[#C45EFF] font-bold">{crossfade}s</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="12"
                                    value={crossfade}
                                    onChange={(e) => setCrossfade(Number(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C45EFF]"
                                />
                                <p className="text-sm text-gray-400 mt-2">Overlap songs for a seamless transition.</p>
                            </div>
                        </div>
                    </motion.section>

                    {/* SECTION: DATA */}
                    <motion.section variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-gray-200">
                            <Zap size={20} className="text-yellow-400" /> Data & Storage
                        </h2>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-white">Clear Cache</h3>
                                <p className="text-sm text-gray-400">Free up space by removing cached lyrics and images.</p>
                            </div>
                            <button
                                onClick={handleClearCache}
                                className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition flex items-center gap-2"
                            >
                                <Trash2 size={16} /> Clear
                            </button>
                        </div>
                    </motion.section>

                    {/* FOOTER */}
                    <motion.div variants={itemVariants} className="text-center text-gray-500 text-sm pt-8">
                        <p>DevTunes v1.0.0</p>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}
