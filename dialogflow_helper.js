const { SessionsClient } = require('@google-cloud/dialogflow-cx');
const config = require('./config');
const path = require('path');

// Pastikan file kredensial ada
const keyFilePath = path.join(__dirname, config.dialogflow.keyFilename);
if (!require('fs').existsSync(keyFilePath)) {
    console.warn(`Peringatan: File kredensial Dialogflow '${config.dialogflow.keyFilename}' tidak ditemukan. Fitur Asisten Awan tidak akan berfungsi.`);
}

const client = new SessionsClient({
    keyFilename: keyFilePath,
    apiEndpoint: `${config.dialogflow.location}-dialogflow.googleapis.com`
});

async function detectIntent(queryText, sessionId) {
    if (!config.dialogflow.projectId || config.dialogflow.projectId === 'YOUR_PROJECT_ID') {
        return "Fitur Asisten Awan belum dikonfigurasi oleh admin. (Project ID tidak ditemukan).";
    }

    const sessionPath = client.projectLocationAgentSessionPath(
        config.dialogflow.projectId,
        config.dialogflow.location,
        config.dialogflow.agentId,
        sessionId
    );

    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: queryText,
            },
            languageCode: config.dialogflow.languageCode,
        },
    };

    try {
        const [response] = await client.detectIntent(request);
        let resultText = '';

        if (response.queryResult.responseMessages && response.queryResult.responseMessages.length > 0) {
            // Gabungkan semua pesan teks dari respons
            resultText = response.queryResult.responseMessages
                .filter(msg => msg.text)
                .map(msg => msg.text.text.join('\n'))
                .join('\n');
        }

        return resultText || "Maaf, saya tidak mengerti. Bisa coba tanyakan dengan cara lain?";

    } catch (error) {
        console.error('Dialogflow Error:', error);
        return 'Maaf, sepertinya Asisten Awan sedang mengalami gangguan. Coba lagi nanti.';
    }
}

module.exports = {
    detectIntent
};
