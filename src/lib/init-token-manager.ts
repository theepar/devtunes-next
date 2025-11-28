// Auto-start token refresh system when server starts
import { tokenManager } from '@/lib/token-manager';

// Initialize auto-refresh on server start
if (typeof window === 'undefined') { // Server-side only
    console.log('🎵 DevTunes Server Starting...');

    // Start the auto-refresh system
    tokenManager.startAutoRefresh();

    // Log token info every 10 minutes (for monitoring)
    setInterval(() => {
        const info = tokenManager.getTokenInfo();
        console.log('📊 Token Status:', {
            hasToken: info.hasToken,
            expiresIn: info.expiresIn,
            isExpired: info.isExpired,
        });
    }, 10 * 60 * 1000); // Every 10 minutes
}

export { tokenManager };
