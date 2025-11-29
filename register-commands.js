
require('dotenv/config');
const { REST, Routes } = require('discord.js');

const TOKEN = process.env.TOKEN;
const { client_id } = require('./config.json');

const commands = [
    {
        name: 'ping',
        description: 'Replies with Pong!'
    },
    {
        name: 'play',
        description: 'Plays a song',
        options: [
            {
                type: 3,
                name: 'url',
                description: 'A direct YouTube / Spotify / ... link',
                required: false
            },
            {
                type: 3,
                name: 'title',
                description: 'A search term (song name)',
                required: false
            },
            {
                type: 3,
                name: "local",
                description: "Pick a local file",
                required: false,
                choices: [
                    { name: "Haruka Kanata - ASIAN KUNG FU GENERATION", value: "haruka_kanata" },
                    { name: "Remembrance - Dads in The Park", value: "remembrance" },
                    { name: "Demons - ImagineDragons", value: "demons" },
                    { name: "Rewrite The Stars - Anne Marie", value: "rewrite_the_stars" },
                    { name: "Dirty - KSI", value: "dirty" },
                    { name: "Life Goes On - BTS", value: "life_goes_on" },
                    { name: "Punorjonmo - Chondropith", value: "punorjonmo" },
                    { name: "Aaoge Tum Kabhi - The Local Train", value: "aaoge_tum_kabhi" },
                    { name: "We Are Young - Fun", value: "we_are_young" },
                    
                ]
            }
        ]
    }
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(client_id),
            { body: commands }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (err) {
        console.error(err);
    }
})();