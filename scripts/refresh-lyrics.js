const fs = require('fs');
const path = require('path');
const { downloadLyrics } = require('./download-music');

const publicDir = path.join(__dirname, '..', 'public');
const libraryPath = path.join(publicDir, 'library.json');

// Load library
function loadLibrary() {
    if (fs.existsSync(libraryPath)) {
        return JSON.parse(fs.readFileSync(libraryPath, 'utf-8'));
    }
    return [];
}

// Save library
function saveLibrary(data) {
    fs.writeFileSync(libraryPath, JSON.stringify(data, null, 2));
}

async function refreshAllLyrics() {
    console.log('🔄 Refreshing lyrics for all songs...\n');

    const library = loadLibrary();
    let updatedCount = 0;

    for (const song of library) {
        console.log(`--------------------------------------------------`);
        console.log(`🎵 Processing: ${song.title}`);

        // Construct search query
        const searchQuery = `${song.title} ${song.composer || ''}`;

        // Try to download lyrics (this will try YouTube CC first, then Genius)
        const lyricsData = await downloadLyrics(searchQuery, song.id, song.title, song.composer);

        if (lyricsData) {
            // Update library entry
            song.lyrics = `/lyrics/${song.id}.json`;
            song.hasLyrics = true;
            updatedCount++;
            console.log(`✅ Updated lyrics for: ${song.title}`);
        } else {
            console.log(`❌ No lyrics found for: ${song.title}`);
        }

        // Delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    // Save updated library
    saveLibrary(library);

    console.log(`\n✨ Done! Updated lyrics for ${updatedCount} songs.`);
}

refreshAllLyrics();
