import React from "react";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

interface Artist {
    id: number;
    name: string;
    count: string;
    image: string;
}

interface FavArtistsProps {
    artists: Artist[];
}

export default function FavArtists({ artists }: FavArtistsProps) {
    return (
        <div className="lg:col-span-4">
            <h2 className="text-xl font-bold mb-4">Fav Artists</h2>
            <div className="space-y-4">
                {artists.map((artist) => (
                    <div key={artist.id} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C45EFF] transition-all">
                                <Image src={artist.image} alt={artist.name} fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm">{artist.name}</h4>
                                <p className="text-[10px] text-gray-500">{artist.count} in library</p>
                            </div>
                        </div>
                        <button className="text-gray-600 hover:text-white transition">
                            <MoreHorizontal size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
