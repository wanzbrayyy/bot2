const { detectIntent } = require('../dialogflow_helper');

module.exports = {
    name: 'awan',
    regex: /\/awan\s*(.*)/,
    execute: async (bot, msg, match) => {
        const chatId = msg.chat.id;
        const query = match[1] ? match[1].trim() : '';

        if (!query) {
            return bot.sendMessage(chatId, '☁️ Halo! Saya Asisten Awan. Ada yang bisa saya bantu? Silakan ketik pertanyaan Anda setelah perintah ini.\n\nContoh: `/awan halo, apa kabar?`');
        }

        try {
            // Tampilkan status "sedang mengetik..."
            bot.sendChatAction(chatId, 'typing');

            // Gunakan chatId sebagai sessionId untuk menjaga kontinuitas percakapan per user
            const sessionId = chatId.toString();
            const responseText = await detectIntent(query, sessionId);

            bot.sendMessage(chatId, `☁️ *Asisten Awan:*\n${responseText}`, { parse_mode: 'Markdown' });

        } catch (error) {
            console.error("Gagal menjalankan perintah /awan:", error);
            bot.sendMessage(chatId, "Maaf, terjadi kesalahan internal saat menghubungi Asisten Awan.");
        }
    }
};
