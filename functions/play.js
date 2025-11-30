
const {
    joinVoiceChannel,
    createAudioPlayer,
    createAudioResource,
    NoSubscriberBehavior,
    AudioPlayerStatus,
    StreamType
} = require('@discordjs/voice');
const ffmpeg = require('ffmpeg-static');

const { EmbedBuilder } = require('discord.js');

const getLocalAudio = require('../utils/getLocalAudio');

const playLocalFile = async (member, interaction, local) => {
    let audio = await getLocalAudio(local);
    let audio_path = audio.path;
    const connection = joinVoiceChannel({
        channelId: member.voice.channel.id,
        guildId: interaction.guild.id,
        adapterCreator: interaction.guild.voiceAdapterCreator
    });
    const player = createAudioPlayer({
        behaviors: { noSubscriber: NoSubscriberBehavior.Pause }
    });

    const resource = createAudioResource(audio_path, {
        metadata: {},
        inlineVolume: false,
        inputType: StreamType.Arbitrary,
        ffmpegExecutablePath: ffmpeg,
        debug: true
    });

    resource.playStream.on('error', async err => {
        await interaction.reply(`🔥 Resource stream error: ${err.message}`);
    });

    player.play(resource);
    connection.subscribe(player);

    const embed = new EmbedBuilder()
        .setColor(0x5865f2)
        .setTitle('Playing a local file')
        .setThumbnail('https://cdn.discordapp.com/attachments/1444274441176748084/1444274498940702731/cat-vibe.gif?ex=692c1cf1&is=692acb71&hm=f7ea85a01c6592f99c336c28879bcae3a4f63b605b4c2b6e8861b216b7009a1a&')
        .setTimestamp()
        .addFields(
            { name: '🎵 Title', value: audio.title, inline: true },
            { name: '📁 File size', value: `${audio.size} MB`, inline: true },
            { name: '⏱️ Duration', value: audio.duration, inline: true },
            { name: '💾 Bit-rate', value: `${Math.round(audio.bitrate / 1000)} kbps`, inline: true }
        );

    await interaction.reply({ embeds: [embed] });

    player.on(AudioPlayerStatus.Idle, async () => {
        const textChannel = interaction.channel;
        await textChannel.send(`Track ended; Replaying... ${audio.title}`);
        setTimeout(() => {
            const newRes = createAudioResource(audio.path, {
                metadata: {},
                inlineVolume: false,
                inputType: StreamType.Arbitrary,
                ffmpegExecutablePath: ffmpeg
            });
            player.play(newRes);
            connection.subscribe(player);
        }, 2500);
    });

    player.on('error', async err => {
        await interaction.reply(`🔥 Player error: ${err}`);
        connection.destroy();
    });
}

const play = async (url, title, local, interaction) => {
    const member = interaction.member;
    if (!member?.voice?.channel) {
        return interaction.reply({ content: '❗ Join a voice channel first.', ephemeral: true });
    }
    if (local) {
        playLocalFile(member, interaction, local);
    }

    if (title) {
        return interaction.reply({ content: 'Under Development!', ephemeral: true });
    }

    if (url) {
        return interaction.reply({ content: 'Under Development!', ephemeral: true });
    }

    // return interaction.reply({ content: 'Great Job!', ephemeral: true });
}

module.exports = play; 
