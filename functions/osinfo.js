
const { EmbedBuilder } = require('discord.js');
const os = require('os');
const checkDiskSpace = require('check-disk-space').default;
const { join } = require('node:path');

const osinfo = async interaction => {
    const ping = interaction.client.ws.ping;
    const uptimeMs = process.uptime() * 1000;
    const seconds = process.uptime();
    const days = Math.floor(uptimeMs / 86_400_000);
    const hrs = Math.floor((uptimeMs % 86_400_000) / 3_600_000);

    const freeMB = Math.round(os.freemem() / 1024 / 1024);
    const load = os.loadavg()[0];
    let disk_free_space = 0;
    let disk_total_space = 0;

    checkDiskSpace(join(__dirname, '/')).then(disk => {
        disk_total_space = Math.round(disk.size / 1024 / 1024 / 1024);
        disk_free_space = Math.round(disk.free / 1024 / 1024 / 1024);
    });

    const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('Information - Simple Play')
        .setTimestamp()
        .addFields(
            { name: 'Platform', value: String(os.platform()), inline: true },
            { name: 'WS Latency', value: `${ping} ms`, inline: true },
            { name: 'Uptime', value: `${days}d & ${hrs}h & ${seconds.toFixed(2)}s`, inline: true },
            { name: 'Free RAM', value: `${freeMB} MB`, inline: true },
            { name: 'CPU (1 m)', value: `${load.toFixed(2)}`, inline: true },
            { name: 'Disk free', value: `${Math.round(disk_free_space / 1e9)} GB`, inline: true }
        );

    await interaction.reply({ embeds: [embed] });
}

module.exports = osinfo;