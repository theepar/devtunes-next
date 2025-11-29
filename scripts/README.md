# 🎵 DevTunes - Music Downloader

## Prerequisites

Install yt-dlp (YouTube downloader):

```bash
# Windows (using pip)
pip install yt-dlp

# Or using winget
winget install yt-dlp

# Or using scoop
scoop install yt-dlp
```

## Usage

### Add a Song from YouTube

**Option 1: With URL argument**
```bash
npm run add-song https://youtube.com/watch?v=xxxxx
```

**Option 2: Interactive mode**
```bash
npm run add-song
```
Then paste YouTube URLs when prompted.

### What Gets Downloaded

- ✅ **Audio** → Converted to MP3 (saved to `public/music/`)
- ✅ **Thumbnail** → Converted to WebP/JPG (saved to `public/images/`)
- ✅ **Lyrics** → From YouTube subtitles if available (saved to `public/lyrics/`)
- ✅ **Metadata** → Title, artist, duration (saved to `public/library.json`)

### Example

```bash
npm run add-song https://www.youtube.com/watch?v=jfKfPfyJRdk
```

Output:
```
🎵 Downloading from YouTube...

📝 Title: lofi hip hop radio 📚 - beats to relax/study to
👤 Channel: Lofi Girl
⏱️  Duration: 0s

✅ Audio downloaded!
✅ Thumbnail downloaded!
📝 Checking for lyrics/subtitles...
✅ Lyrics saved! (45 lines)
✅ Added to library!
```

Files created:
```
public/
├── music/
│   └── 1732901234567.mp3
├── images/
│   └── 1732901234567.webp
├── lyrics/
│   └── 1732901234567.json  (if lyrics available)
└── library.json (updated)
```

## Workflow

1. **Development** (Local):
   - Add songs using `npm run add-song`
   - Test the player with `npm run dev`
   
2. **Production** (Deploy):
   - All music files are already in `public/`
   - Just deploy to Vercel/Netlify
   - No API keys needed!

## Library Management

View your library:
```json
// public/library.json
[
  {
    "id": 1732901234567,
    "title": "Song Title",
    "composer": "Artist Name",
    "image": "/images/1732901234567.webp",
    "file": "/music/1732901234567.mp3",
    "duration": 240,
    "addedAt": "2025-01-29T10:00:00.000Z",
    "lyrics": "/lyrics/1732901234567.json",
    "hasLyrics": true
  }
]
```

### Lyrics Format

If lyrics are available, they are saved as JSON:
```json
// public/lyrics/1732901234567.json
{
  "songId": 1732901234567,
  "title": "Song Title",
  "lyrics": "Line 1\nLine 2\nLine 3...",
  "lyricsArray": ["Line 1", "Line 2", "Line 3"],
  "source": "youtube-subtitles",
  "downloadedAt": "2025-01-29T10:00:00.000Z"
}
```

## Notes

- File names use unique timestamp IDs for reliability
- Lyrics are only available if the YouTube video has closed captions/subtitles
- Official music videos often have lyrics in subtitles
- All files are optimized for web playback

## Troubleshooting

**Error: "yt-dlp not found"**
- Install yt-dlp using one of the methods above

**Error: "Could not download thumbnail"**
- Video might not have a thumbnail
- Fortsuna.json will use placeholder image

**Slow downloads?**
- Normal for High-quality audio
- Average: 30-60 seconds per song
