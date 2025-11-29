import React from "react";
import { Music, Mic2, Zap, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function PlaylistGrid() {
    return (
        <div className="mb-12 relative">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative w-full rounded-[2.5rem] overflow-hidden bg-gradient-to-r from-[#1A1A1A] to-[#0D0714] border border-white/5 shadow-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                {/* Text Content */}
                <div className="flex-1 relative z-10 text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C45EFF] to-blue-500">DevTunes</span>
                        </h2>
                        <p className="text-lg text-gray-400 mb-8 leading-relaxed max-w-xl">
                            The ultimate music experience designed for focus and flow.
                            Enjoy high-fidelity audio, perfectly synchronized lyrics, and a distraction-free interface built for developers.
                        </p>
                    </motion.div>

                    {/* Feature Pills */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                        {[
                            { icon: Headphones, label: "Hi-Fi Audio" },
                            { icon: Mic2, label: "Synced Lyrics" },
                            { icon: Zap, label: "Zero Ads" },
                            { icon: Music, label: "Curated for Focus" }
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (idx * 0.1) }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                            >
                                <feature.icon size={16} className="text-[#C45EFF]" />
                                {feature.label}
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Visual Element (Right Side) */}
                <div className="relative z-10 shrink-0">
                    <div className="relative w-64 h-64 md:w-80 md:h-80">
                        {/* Abstract Circle Rings */}
                        <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
                        <div className="absolute inset-4 rounded-full border border-white/5 animate-[spin_15s_linear_infinite_reverse]" />
                        <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_20s_linear_infinite]" />

                        {/* Center Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#C45EFF] to-blue-600 blur-2xl opacity-50 absolute" />
                            <div className="w-24 h-24 rounded-full bg-[#0D0714] border border-white/10 flex items-center justify-center relative shadow-xl">
                                <Music size={40} className="text-white" />
                            </div>
                        </div>

                        {/* Floating Elements */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute top-10 right-10 p-3 rounded-xl bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 shadow-lg"
                        >
                            <Mic2 size={20} className="text-blue-400" />
                        </motion.div>
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute bottom-10 left-10 p-3 rounded-xl bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 shadow-lg"
                        >
                            <Headphones size={20} className="text-purple-400" />
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
