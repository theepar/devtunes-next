const YTDlpWrap = require('yt-dlp-wrap').default;
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const publicDir = path.join(__dirname, '..', 'public');
const musicDir = path.join(publicDir, 'music');
const imagesDir = path.join(publicDir, 'images');
const lyricsDir = path.join(publicDir, 'lyrics');
const libraryPath = path.join(publicDir, 'library.json');

// Ensure directories exist
[musicDir, imagesDir, lyricsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Load existing library
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

// Check if input is URL or search query
function isYouTubeUrl(input) {
    return input.includes('youtube.com') || input.includes('youtu.be');
}

// Download lyrics from YouTube subtitles
async function downloadLyrics(searchQuery, songId, title) {
    const ytDlpWrap = new YTDlpWrap();
    const lyricsFile = path.join(lyricsDir, `${songId}.json`);

    try {
        console.log('\n📝 Checking for lyrics/subtitles...\n');

        // Try to download subtitles (many music videos have lyrics as CC)
        const tempSubPath = path.join(lyricsDir, `${songId}`);

        await ytDlpWrap.execPromise([
            searchQuery,
            '--skip-download',
            '--write-subs',
            '--write-auto-subs',
            '--sub-langs', 'en,id',
            '--sub-format', 'vtt',
            '--convert-subs', 'vtt',
            '-o', tempSubPath,
            '--no-playlist'
        ]);

        // Wait for file system
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Look for subtitle file
        const files = fs.readdirSync(lyricsDir);
        const subFile = files.find(f => f.startsWith(songId.toString()) && f.endsWith('.vtt'));

        if (subFile) {
            const subPath = path.join(lyricsDir, subFile);
            const content = fs.readFileSync(subPath, 'utf-8');

            // Parse VTT to clean lyrics
            const lines = content.split('\n');
            const lyrics = [];
            let currentText = '';

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].trim();

                // Skip WEBVTT header and timestamps
                if (line.startsWith('WEBVTT') || line.includes('-->') || line === '') continue;

                // Clean text (remove tags, duplicates)
                const cleanLine = line.replace(/<[^>]*>/g, '').trim();
                if (cleanLine && cleanLine !== currentText) {
                    lyrics.push(cleanLine);
                    currentText = cleanLine;
                }
            }

            if (lyrics.length > 0) {
                // Save as JSON
                const lyricsData = {
                    songId,
                    title,
                    lyrics: lyrics.join('\n'),
                    lyricsArray: lyrics,
                    source: 'youtube-subtitles',
                    downloadedAt: new Date().toISOString()
                };

                fs.writeFileSync(lyricsFile, JSON.stringify(lyricsData, null, 2));
                console.log(`✅ Lyrics saved! (${lyrics.length} lines)\n`);

                // Clean up VTT file
                fs.unlinkSync(subPath);
                return lyricsData;
            }
        }

        console.log('ℹ️  No lyrics/subtitles available\n');
        return null;

    } catch (error) {
        console.log('ℹ️  Lyrics not available for this video\n');
        return null;
    }
}

// Download from YouTube (URL or search query)
async function downloadFromYouTube(input) {
    const ytDlpWrap = new YTDlpWrap();
    const songId = Date.now();

    // Determine if URL or search query
    const isUrl = isYouTubeUrl(input);
    const searchQuery = isUrl ? input : `ytsearch:${input}`;

    if (!isUrl) {
        console.log('\n⚠️  Using search query - URL is more accurate!\n');
        console.log(`� Searching YouTube for: "${input}"\n`);
    } else {
        console.log('\n🎵 Downloading from YouTube...\n');
    }

    try {
        // Get video info
        console.log('📝 Getting video info...\n');
        const infoString = await ytDlpWrap.execPromise([
            searchQuery,
            '--dump-json',
            '--no-playlist'
        ]);

        const info = JSON.parse(infoString);
        const audioFile = `${songId}.mp3`;

        console.log(`📝 Title: ${info.title}`);
        console.log(`👤 Channel: ${info.uploader || info.channel}`);
        console.log(`⏱️  Duration: ${Math.floor(info.duration)}s`);
        console.log(`🆔 ID: ${songId}\n`);

        // Download audio
        console.log('🎵 Downloading audio...\n');
        await ytDlpWrap.execPromise([
            searchQuery,
            '-x',
            '--audio-format', 'mp3',
            '--audio-quality', '0',
            '--ffmpeg-location', ffmpegPath,
            '-o', path.join(musicDir, audioFile),
            '--no-playlist'
        ]);

        console.log('✅ Audio downloaded!\n');

        // Download thumbnail
        console.log('🖼️  Downloading thumbnail...\n');
        let imageFile = null;

        try {
            await ytDlpWrap.execPromise([
                searchQuery,
                '--skip-download',
                '--write-thumbnail',
                '--convert-thumbnails', 'webp',
                '-o', path.join(imagesDir, songId.toString()),
                '--no-playlist'
            ]);

            // Wait for file system
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Detect saved format
            const possibleFormats = ['webp', 'jpg', 'jpeg', 'png'];
            for (const format of possibleFormats) {
                const filePath = path.join(imagesDir, `${songId}.${format}`);
                if (fs.existsSync(filePath)) {
                    imageFile = `${songId}.${format}`;
                    console.log(`✅ Thumbnail saved as ${format.toUpperCase()}!\n`);
                    break;
                }
            }

            if (!imageFile) {
                // Fallback: scan directory
                const files = fs.readdirSync(imagesDir);
                const matchingFile = files.find(f => f.startsWith(songId.toString()));
                if (matchingFile) {
                    imageFile = matchingFile;
                    console.log(`✅ Thumbnail found: ${matchingFile}!\n`);
                } else {
                    console.warn('⚠️  Thumbnail not found\n');
                    imageFile = 'placeholder.jpg';
                }
            }
        } catch (error) {
            console.warn('⚠️  Could not download thumbnail\n');
            imageFile = 'placeholder.jpg';
        }

        // Create library entry
        const entry = {
            id: songId,
            title: info.title,
            composer: info.uploader || info.channel || 'Unknown Artist',
            image: `/images/${imageFile}`,
            file: `/music/${audioFile}`,
            duration: Math.floor(info.duration || 0),
            addedAt: new Date().toISOString(),
            source: isUrl ? 'youtube-url' : 'youtube-search'
        };

        // Add to library
        const library = loadLibrary();
        library.push(entry);
        saveLibrary(library);

        console.log('✅ Added to library!\n');
        console.log('📦 Entry:', JSON.stringify(entry, null, 2));

        // Download lyrics (optional - won't fail if not available)
        const lyricsData = await downloadLyrics(searchQuery, songId, info.title);

        // Update entry with lyrics if available
        if (lyricsData) {
            entry.lyrics = `/lyrics/${songId}.json`;
            entry.hasLyrics = true;

            // Update library
            const updatedLibrary = loadLibrary();
            const index = updatedLibrary.findIndex(e => e.id === songId);
            if (index !== -1) {
                updatedLibrary[index] = entry;
                saveLibrary(updatedLibrary);
            }
        }

        return entry;
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        if (!isUrl) {
            console.log('\n💡 Tip: Try using YouTube URL for better accuracy\n');
        }
        throw error;
    }
}

// Interactive mode
function interactiveMode() {
    rl.question('\n🔗 Enter YouTube URL or song title (or "exit"): ', async (answer) => {
        if (answer.toLowerCase() === 'exit') {
            console.log('\n👋 Goodbye!\n');
            rl.close();
            return;
        }

        if (!answer.trim()) {
            console.log('❌ Please enter a URL or title');
            interactiveMode();
            return;
        }

        try {
            await downloadFromYouTube(answer.trim());
            console.log('\n✨ Song added successfully!\n');
        } catch (error) {
            console.error('\n❌ Failed to add song');
        }

        interactiveMode();
    });
}

// Main
async function main() {
    console.log('\n🎵 DevTunes - Music Downloader\n');
    console.log('📁 Music: public/music/ | Images: public/images/');
    console.log('🎯 Input: YouTube URL (recommended) or Song Title\n');

    console.log('🔧 Initializing yt-dlp...\n');

    try {
        // Download yt-dlp binary if needed
        await YTDlpWrap.downloadFromGithub();

        console.log('✅ yt-dlp ready!');
        console.log(`✅ FFmpeg: ${ffmpegPath}`);
        console.log(`✅ FFprobe: ${ffprobePath}\n`);

        const inputArg = process.argv[2];

        if (inputArg) {
            await downloadFromYouTube(inputArg);
            console.log('\n✨ Done!\n');
            process.exit(0);
        } else {
            interactiveMode();
        }
    } catch (error) {
        console.error('❌ Failed to initialize:', error.message);
        console.log('\nTry: npm install --force\n');
        process.exit(1);
    }
}

main();
