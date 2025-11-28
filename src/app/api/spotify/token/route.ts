import { NextResponse } from 'next/server';
import { tokenManager } from '@/lib/token-manager';

// GET - Get token info
export async function GET() {
    try {
        const info = tokenManager.getTokenInfo();
        const token = await tokenManager.getAccessToken();

        return NextResponse.json({
            success: true,
            tokenInfo: info,
            accessToken: token.substring(0, 20) + '...' + token.substring(token.length - 10), // Masked token
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

// POST - Manual refresh token
export async function POST() {
    try {
        const token = await tokenManager.refreshToken();
        const info = tokenManager.getTokenInfo();

        return NextResponse.json({
            success: true,
            message: 'Token refreshed successfully',
            tokenInfo: info,
            accessToken: token.substring(0, 20) + '...' + token.substring(token.length - 10), // Masked token
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
