// Spotify API Utilities
export interface SpotifyTrack {
    id: string;
    name: string;
    artists: {
        name: string;
    }[];
    album: {
        name: string;
        images: {
            url: string;
            height: number;
            width: number;
        }[];
    };
    duration_ms: number;
    preview_url: string | null;
}

export interface SpotifyPlaylist {
    id: string;
    name: string;
    description: string;
    images: {
        url: string;
        height: number;
        width: number;
    }[];
    tracks: {
        total: number;
    };
    owner: {
        display_name: string;
    };
}

const SPOTIFY_BASE_URL = 'https://api.spotify.com/v1';

// Fungsi untuk fetch track dari Spotify
export async function getSpotifyTrack(trackId: string, accessToken: string): Promise<SpotifyTrack> {
    const response = await fetch(`${SPOTIFY_BASE_URL}/tracks/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch track: ${response.statusText}`);
    }

    return response.json();
}

// Fungsi untuk fetch multiple tracks
export async function getSpotifyTracks(trackIds: string[], accessToken: string): Promise<SpotifyTrack[]> {
    const response = await fetch(
        `${SPOTIFY_BASE_URL}/tracks?ids=${trackIds.join(',')}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch tracks: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tracks;
}

// Fungsi untuk fetch playlist
export async function getSpotifyPlaylist(playlistId: string, accessToken: string): Promise<SpotifyPlaylist> {
    const response = await fetch(`${SPOTIFY_BASE_URL}/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.statusText}`);
    }

    return response.json();
}

// Fungsi untuk fetch featured playlists
export async function getFeaturedPlaylists(accessToken: string, limit: number = 10) {
    const response = await fetch(
        `${SPOTIFY_BASE_URL}/browse/featured-playlists?limit=${limit}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to fetch featured playlists: ${response.statusText}`);
    }

    const data = await response.json();
    return data.playlists.items;
}

// Fungsi untuk search
export async function searchSpotify(query: string, type: string, accessToken: string, limit: number = 20) {
    const response = await fetch(
        `${SPOTIFY_BASE_URL}/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`,
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        throw new Error(`Failed to search: ${response.statusText}`);
    }

    return response.json();
}
