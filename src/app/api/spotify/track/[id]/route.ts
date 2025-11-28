import { NextResponse } from 'next/server';
import { getSpotifyTrack } from '@/lib/spotify';
import { getSpotifyAccessToken } from '@/lib/token-manager';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Get valid access token (auto-refreshed if needed)
        const accessToken = await getSpotifyAccessToken();

        const track = await getSpotifyTrack(params.id, accessToken);

        return NextResponse.json(track);
    } catch (error) {
        console.error('Error fetching Spotify track:', error);
        return NextResponse.json(
            { error: 'Failed to fetch track from Spotify' },
            { status: 500 }
        );
    }
}
