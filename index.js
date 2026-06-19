import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 10000; // Render aksar 10000 port deta hai

app.get('/', (req, res) => res.send('Bot is active!'));
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

async function startBot() {
    console.log("Bot start ho raha hai..."); // Ye log check karna
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        browser: ["Chrome (Linux)", "Chrome", "1.0.0"] // Browser identify karwaya
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        
        if (qr) {
            console.log("QR Code generate ho gaya, niche dekho:");
            qrcode.generate(qr, { small: true });
        }
        
        if (connection === 'open') {
            console.log('Bot successfully connected!');
        } else if (connection === 'close') {
            console.log('Connection closed, restarting...');
            startBot();
        }
    });
}

startBot();
