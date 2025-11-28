import { NextResponse } from 'next/server';
import { getFeaturedPlaylists } from '@/lib/spotify';
import { getSpotifyAccessToken } from '@/lib/token-manager';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '10');

        // Get valid access token (auto-refreshed if needed)
        const accessToken = await getSpotifyAccessToken();

        const playlists = await getFeaturedPlaylists(accessToken, limit);

        return NextResponse.json({ playlists });
    } catch (error) {
        console.error('Error fetching featured playlists:', error);
        return NextResponse.json(
            { error: 'Failed to fetch playlists from Spotify' },
            { status: 500 }
        );
    }
}
