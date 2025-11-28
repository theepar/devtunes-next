// Custom hook untuk fetching Spotify data
'use client';

import { useState, useEffect } from 'react';

export interface PlaylistData {
    id: string;
    name: string;
    description: string;
    images: { url: string }[];
    tracks: { total: number };
    owner: { display_name: string };
}

export function useSpotifyPlaylists(limit: number = 10) {
    const [playlists, setPlaylists] = useState<PlaylistData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                setLoading(true);
                const response = await fetch(`/api/spotify/playlists?limit=${limit}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch playlists');
                }

                const data = await response.json();
                setPlaylists(data.playlists || []);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setPlaylists([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPlaylists();
    }, [limit]);

    return { playlists, loading, error };
}

export function useSpotifyTrack(trackId: string | null) {
    const [track, setTrack] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!trackId) return;

        async function fetchTrack() {
            try {
                setLoading(true);
                const response = await fetch(`/api/spotify/track/${trackId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch track');
                }

                const data = await response.json();
                setTrack(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setTrack(null);
            } finally {
                setLoading(false);
            }
        }

        fetchTrack();
    }, [trackId]);

    return { track, loading, error };
}
