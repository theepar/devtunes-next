// Spotify Token Manager (Vercel/Serverless Compatible)
import fs from 'fs';
import path from 'path';
import os from 'os';

interface TokenData {
    access_token: string;
    token_type: string;
    expires_in: number;
    expires_at: number;
}

class SpotifyTokenManager {
    private static instance: SpotifyTokenManager;
    private tokenData: TokenData | null = null;
    // Gunakan /tmp directory untuk Vercel (satu-satunya folder writable di serverless)
    private tokenFilePath = path.join(os.tmpdir(), 'spotify-token.json');

    private constructor() {
        this.loadToken();
    }

    public static getInstance(): SpotifyTokenManager {
        if (!SpotifyTokenManager.instance) {
            SpotifyTokenManager.instance = new SpotifyTokenManager();
        }
        return SpotifyTokenManager.instance;
    }

    private loadToken(): void {
        try {
            if (fs.existsSync(this.tokenFilePath)) {
                const data = fs.readFileSync(this.tokenFilePath, 'utf-8');
                this.tokenData = JSON.parse(data);
            }
        } catch (error) {
            console.error('Error loading token cache:', error);
        }
    }

    private saveToken(tokenData: TokenData): void {
        try {
            fs.writeFileSync(this.tokenFilePath, JSON.stringify(tokenData));
        } catch (error) {
            console.error('Error saving token cache:', error);
        }
    }

    private isTokenExpired(bufferSeconds: number = 60): boolean {
        if (!this.tokenData) return true;
        const now = Date.now();
        return now >= (this.tokenData.expires_at - bufferSeconds * 1000);
    }

    public async refreshToken(): Promise<string> {
        try {
            const clientId = process.env.SPOTIFY_CLIENT_ID;
            const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

            if (!clientId || !clientSecret) {
                throw new Error('Spotify credentials not configured in Environment Variables');
            }

            // Encode credentials
            const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

            const response = await fetch('https://accounts.spotify.com/api/token', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'grant_type=client_credentials',
                cache: 'no-store'
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Spotify API Error: ${response.status} ${errorText}`);
            }

            const data = await response.json();

            this.tokenData = {
                access_token: data.access_token,
                token_type: data.token_type,
                expires_in: data.expires_in,
                expires_at: Date.now() + (data.expires_in * 1000),
            };

            this.saveToken(this.tokenData);
            return this.tokenData.access_token;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            throw error;
        }
    }

    // Main method to get token - handles auto-refresh logic
    public async getAccessToken(): Promise<string> {
        if (!this.tokenData || this.isTokenExpired()) {
            return await this.refreshToken();
        }
        return this.tokenData.access_token;
    }

    // Helper for monitoring
    public getTokenInfo() {
        if (!this.tokenData) return { status: 'No token' };
        const expiresIn = Math.floor((this.tokenData.expires_at - Date.now()) / 1000);
        return {
            status: expiresIn > 0 ? 'Valid' : 'Expired',
            expiresInSeconds: expiresIn,
            expiresAt: new Date(this.tokenData.expires_at).toISOString()
        };
    }

    // No-op for serverless (not needed as we check on every request)
    public startAutoRefresh() { }
}

export const tokenManager = SpotifyTokenManager.getInstance();

export async function getSpotifyAccessToken(): Promise<string> {
    return await tokenManager.getAccessToken();
}
