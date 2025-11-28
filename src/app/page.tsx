'use client';

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { motion } from "framer-motion";

// Komponen Card Reusable dengan Framer Motion
const PlaylistCard = ({ item, index }: { item: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -8 }}
  >
    <Link
      href={`/playlist/${item.id}`}
      className="group relative bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-300 ease-in-out block"
    >
      <div className="relative aspect-square w-full mb-4 shadow-lg overflow-hidden rounded-md">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
        {/* Play Button on Hover */}
        <div className="absolute bottom-2 right-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 shadow-xl z-20">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-purple-600 rounded-full p-3 shadow-lg hover:scale-105 hover:bg-purple-500"
          >
            <Play fill="black" size={20} className="text-black ml-0.5" />
          </motion.div>
        </div>
      </div>
      <h3 className="font-bold text-white truncate mb-1">{item.title}</h3>
      <p className="text-sm text-gray-400 line-clamp-2">By {item.composer || "Unknown"}</p>
    </Link>
  </motion.div>
);

export default function Home() {
  // Data Mockup
  const featuredPlaylists = [
    { id: 1, title: "Lo-Fi Beats", image: "/images/lofi.jpg", composer: "Chillhop" },
    { id: 2, title: "Coding Mode", image: "/images/code.jpg", composer: "DevTunes" },
    { id: 3, title: "Night Drive", image: "/images/drive.jpg", composer: "Synthwave" },
    { id: 4, title: "Workout", image: "/images/gym.jpg", composer: "Fitness" },
  ];

  return (
    <div className="min-h-screen pb-32">


      <main className="max-w-7xl mx-auto px-8 pt-32">
        <div className="space-y-10 py-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-purple-900/80 to-neutral-900 p-8 md:p-12 rounded-2xl flex flex-col md:flex-row items-center gap-8 border border-white/5"
          >
            <div className="space-y-4 flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold leading-tight"
              >
                Welcome to the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                  Sound of Harmony
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-gray-300 max-w-lg text-lg"
              >
                Experience the magic of music like never before. Dive into a world where melodies paint emotions.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex items-center gap-4 pt-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(139, 92, 246, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Listening
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-xl border-2 border-purple-500/30 text-white font-semibold hover:bg-purple-500/10 transition-all duration-300"
                >
                  Browse Library
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative w-full md:w-1/2 aspect-square rounded-2xl overflow-hidden glass-card p-2"
            >
              <div className="relative w-full h-full rounded-xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=800&h=800&fit=crop"
                  alt="Featured Music"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 via-transparent to-transparent" />
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-30 pointer-events-none"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-500 rounded-full filter blur-3xl opacity-20 pointer-events-none"
              />
            </motion.div>
          </motion.div>

          {/* Section: Featured Playlists */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex justify-between items-end mb-6"
            >
              <h2 className="text-2xl font-bold text-white">Featured Playlists</h2>
              <Link
                href="/playlist"
                className="text-sm text-gray-400 hover:text-white uppercase font-bold tracking-wider transition-colors"
              >
                See All
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {featuredPlaylists.map((item, index) => (
                <PlaylistCard key={item.id} item={item} index={index} />
              ))}
            </div>
          </section>

          {/* Section: New Releases */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h2 className="text-2xl font-bold text-white mb-6">New Releases</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...featuredPlaylists].reverse().map((item, index) => (
                  <PlaylistCard key={`new-${item.id}`} item={item} index={index} />
                ))}
              </div>
            </motion.div>
          </section>
        </div>
      </main>


    </div>
  );
}
