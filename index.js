import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal'; // Isse add karna padega

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        // printQRInTerminal: true  <-- Ise yahan se hata diya
    });

    sock.ev.on('creds.update', saveCreds);

    // QR Code ke liye naya tarika
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log("Scan this QR code to login.");
        }
        
        if (connection === 'open') console.log('Bot is ready! Pong.');
        if (connection === 'close') startBot();
    });
}

startBot();
