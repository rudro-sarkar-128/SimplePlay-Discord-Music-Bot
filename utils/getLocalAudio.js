const fs = require('node:fs');
const ffprobe = require('ffprobe-static');
const mm = require('music-metadata');
const path = require('path');

const formatText = str => {
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

const getLocalAudio = async local => {
    let audio_path = path.join(__dirname, '..', 'localMusic', `${local}.mp3`);
    let audio_track = formatText(local);

    const stat = fs.statSync(audio_path);
    const size = (stat.size / (1024 * 1024)).toFixed(2);

    const meta = await mm.parseFile(audio_path, {
        duration: true,
        skipCovers: true,
        fileSize: stat.size,
        probeSize: 64 * 1024,
        ffmpegPath: ffprobe.path
    });

    let duration = `${Math.floor((meta.format.duration / 60))}min & ${Math.floor((meta.format.duration % 60))}sec`;

    let audio = {
        title: audio_track,
        path: audio_path,
        size: size,
        duration: duration,
        bitrate: meta.format.bitrate
    }
    return audio;
}

module.exports = getLocalAudio;