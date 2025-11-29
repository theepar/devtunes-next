"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Heart, Zap, ArrowLeft, Github } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0D0714] text-white font-sans selection:bg-[#C45EFF] selection:text-white overflow-x-hidden relative">

            {/* --- BACKGROUND BLOBS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/40 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[120px]" />
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">

                {/* HEADER & BACK BUTTON */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-12"
                >
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group">
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Player
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        Behind DevTunes
                    </h1>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12"
                >
                    {/* LEFT COL: PURPOSE (Col 5) */}
                    <div className="lg:col-span-5 space-y-8">
                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C45EFF] to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20">
                                <Zap size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Why DevTunes?</h2>
                            <p className="text-gray-400 leading-relaxed">
                                Coding requires a specific state of mind—flow. Standard music players are cluttered with ads, social features, and distractions.
                                <br /><br />
                                <span className="text-white font-medium">DevTunes is different.</span> It's built strictly for focus. High-fidelity audio, curated playlists for deep work, and a minimal interface that gets out of your way.
                            </p>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex items-center gap-6">
                            <div className="p-4 rounded-full bg-blue-500/10 text-blue-400">
                                <Code2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Built for Developers</h3>
                                <p className="text-sm text-gray-400">Optimized for long coding sessions.</p>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex items-center gap-6">
                            <div className="p-4 rounded-full bg-pink-500/10 text-pink-400">
                                <Heart size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Open Source Heart</h3>
                                <p className="text-sm text-gray-400">Crafted with passion and modern tech.</p>
                            </div>
                        </motion.div>
                    </div>

                    {/* RIGHT COL: DEVELOPERS (Col 7) */}
                    <motion.div variants={itemVariants} className="lg:col-span-7">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            Meet the Team <Code2 size={20} className="text-[#C45EFF]" />
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                {
                                    name: "Deva Gundhala",
                                    role: "Front End Developer",
                                    github: "https://github.com/theepar",
                                    color: "from-[#C45EFF] to-purple-600"
                                },
                                {
                                    name: "Tristan Putra",
                                    role: "Back End Developer",
                                    github: "https://github.com/Tristanputra2119",
                                    color: "from-blue-500 to-cyan-500"
                                },
                                {
                                    name: "Triana Putri",
                                    role: "Back End Developer",
                                    github: "https://github.com/Nanaana11",
                                    color: "from-pink-500 to-rose-500"
                                }
                            ].map((dev, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ y: -5 }}
                                    className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col items-center text-center relative overflow-hidden group"
                                >
                                    {/* Decorative Gradient */}
                                    <div className={`absolute top-0 inset-x-0 h-24 bg-gradient-to-b ${dev.color} opacity-20`} />

                                    <div className="relative w-24 h-24 mb-4 mt-4">
                                        <div className={`absolute inset-0 bg-gradient-to-tr ${dev.color} rounded-full blur-lg opacity-60 group-hover:opacity-100 transition duration-500`} />
                                        <div className="relative w-full h-full rounded-full border-4 border-[#0D0714] overflow-hidden bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-500">
                                            {dev.name.charAt(0)}
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-bold mb-1">{dev.name}</h3>
                                    <p className={`text-sm font-medium mb-6 bg-clip-text text-transparent bg-gradient-to-r ${dev.color}`}>
                                        {dev.role}
                                    </p>

                                    <div className="mt-auto flex gap-3">
                                        <Link href={dev.github} target="_blank" className="p-2 rounded-xl bg-white/5 hover:bg-white/10 hover:text-white transition-all border border-white/5">
                                            <Github size={18} />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </div>
    );
}
