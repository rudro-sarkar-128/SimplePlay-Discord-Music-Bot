require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const { notice_channel } = require('./config.json');

//Multi Instance killer for hosting
const { writeFileSync, unlinkSync, existsSync, readFileSync } = require('fs');
const { pid } = require('process');

const PID_FILE = './bot.pid';
let duplicateMessage = null;

if (existsSync(PID_FILE)) {
    const oldPid = Number(readFileSync(PID_FILE, 'utf8').trim());
    try {
        process.kill(oldPid, 0);
        duplicateMessage = (client) =>
            client.channels.fetch(notice_channel)
                .then(ch => ch.isTextBased() && ch.send('⚠️  Host tried to spin up a new session – duplicate was killed.'))
                .catch(() => { });
        process.exit(0);
    } catch {
        client.channels.fetch(notice_channel)
            .then(ch => ch.isTextBased() && ch.send('Error!'))
            .catch(() => { });
    }
}
writeFileSync(PID_FILE, String(pid));
const cleanup = () => { try { unlinkSync(PID_FILE); } catch { } };
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);



// let is_aes256gsm_available = require('node:crypto').getCiphers().includes('aes-256-gcm');

const readyEvent = require('./handlers/ready');
const interactionEvent = require('./handlers/interactionCreate');

client.once(readyEvent.name, (...args) => readyEvent.execute(client, ...args));
client.on(interactionEvent.name, (...args) => interactionEvent.execute(client, ...args));

const TOKEN = process.env.TOKEN;
client.login(TOKEN);

module.exports = client;
