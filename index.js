import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;
        
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

        // 1. .sticker command
        if (text === '.sticker') {
            await sock.sendMessage(from, { text: 'Sticker feature active!' });
        }

        // 2. .yt aur .ig command
        if (text.startsWith('.yt') || text.startsWith('.ig')) {
            await sock.sendMessage(from, { text: 'Downloading media, please wait...' });
        }

        // 3. View Once Handler (Auto detect)
        if (msg.message.viewOnceMessage) {
            await sock.sendMessage(from, { text: 'View Once message detected!' });
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') console.log('Bot is ready! Pong.');
        if (connection === 'close') startBot();
    });
}

startBot();
