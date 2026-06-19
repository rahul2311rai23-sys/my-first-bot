import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.message) return;

        const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
        const from = msg.key.remoteJid;

        // Command: .sticker
        if (body === '.sticker') {
            console.log("Sticker command received");
            // Yahan sticker processing ka code aayega
        }

        // Command: .yt ya .ig
        if (body.startsWith('.yt') || body.startsWith('.ig')) {
            console.log("Downloading media...");
        }

        // View Once Handler
        if (msg.message.viewOnceMessage) {
            console.log("View Once message detected!");
        }
    });

    sock.ev.on('connection.update', (update) => {
        if (update.connection === 'open') console.log('Bot is ready! Pong.');
        if (update.connection === 'close') startBot();
    });
}

startBot();
