const fs = require('fs');
const path = require('path');
const Genius = require("genius-lyrics");
const Client = new Genius.Client();

const publicDir = path.join(__dirname, '..', 'public');
const lyricsDir = path.join(publicDir, 'lyrics');
const libraryPath = path.join(publicDir, 'library.json');

// Ensure lyrics directory exists
if (!fs.existsSync(lyricsDir)) {
    fs.mkdirSync(lyricsDir, { recursive: true });
}

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

async function fetchMissingLyrics() {
    const library = loadLibrary();
    let updatedCount = 0;

    console.log(`📚 Checking ${library.length} songs for missing lyrics...\n`);

    for (let i = 0; i < library.length; i++) {
        const song = library[i];

        if (song.hasLyrics) {
            console.log(`✅ [${i + 1}/${library.length}] "${song.title}" already has lyrics.`);
            continue;
        }

        console.log(`🔍 [${i + 1}/${library.length}] Fetching lyrics for: "${song.title}" (${song.composer})...`);

        try {
            // Clean title and artist
            const cleanTitle = song.title
                .replace(/(\(.*?\)|\{.*?\}|\[.*?\]|Official|Video|Lyrics|Audio|ft\.|feat\.|x |with )/gi, '')
                .trim();

            const cleanArtist = song.composer
                .replace(/ - Topic/g, '')
                .replace(/VEVO/g, '')
                .trim();

            const query = `${cleanArtist} ${cleanTitle}`;
            console.log(`   🔍 Searching Genius for: "${query}"...`);

            const searches = await Client.songs.search(query);

            if (searches && searches.length > 0) {
                const firstSong = searches[0];
                console.log(`   ✨ Found on Genius: "${firstSong.title}" by ${firstSong.artist.name}`);

                const lyricsText = await firstSong.lyrics();

                if (lyricsText) {
                    const lyricsArray = lyricsText.split('\n').map(l => l.trim()).filter(l => l);
                    const lyricsFile = path.join(lyricsDir, `${song.id}.json`);

                    const lyricsData = {
                        songId: song.id,
                        title: song.title,
                        lyrics: lyricsText,
                        lyricsArray: lyricsArray,
                        source: 'genius-lyrics',
                        downloadedAt: new Date().toISOString()
                    };

                    fs.writeFileSync(lyricsFile, JSON.stringify(lyricsData, null, 2));

                    // Update library entry
                    library[i].lyrics = `/lyrics/${song.id}.json`;
                    library[i].hasLyrics = true;
                    updatedCount++;

                    console.log(`   ✅ Lyrics saved! (${lyricsArray.length} lines)`);
                } else {
                    console.log(`   ❌ Lyrics text empty.`);
                }
            } else {
                console.log(`   ❌ Not found on Genius.`);
            }

        } catch (error) {
            console.error(`   ❌ Error fetching lyrics: ${error.message}`);
        }

        // Add a small delay to be polite
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if (updatedCount > 0) {
        saveLibrary(library);
        console.log(`\n✨ Updated ${updatedCount} songs with new lyrics!`);
    } else {
        console.log('\n✨ No new lyrics found.');
    }
}

fetchMissingLyrics();
