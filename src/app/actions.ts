'use server'

import translate from 'google-translate-api-x';

export async function translateLyrics(lines: string[], targetLang: string = 'id') {
    try {
        // Join lines to reduce requests (Google Translate handles newlines)
        const text = lines.join('\n');

        const res = await translate(text, { to: targetLang });

        // Split back into array
        const translatedLines = res.text.split('\n');

        return { success: true, data: translatedLines };
    } catch (error: any) {
        console.error("Translation error:", error);
        return { success: false, error: error.message };
    }
}
