import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';
import pino from 'pino';
import express from 'express'; // Express add kiya

const app = express();
const PORT = process.env.PORT || 3000;

// Render ko chahiye ki koi port open ho, isliye humne ye server banaya
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function startBot() {
    // ... baki ka bot code wahi rahega ...
    const { state, saveCreds } = await useMultiFileAuthState('auth_info');
    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
    });
    // ...
}
startBot();
