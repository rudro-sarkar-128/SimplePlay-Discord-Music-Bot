
const { Events } = require('discord.js');

const play = require('../functions/play');

module.exports = {
  name: Events.InteractionCreate,
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ping') {
      await interaction.reply('Pong!');
    }

    if (interaction.commandName === 'play') {
      const url = interaction.options.getString('url');
      const title = interaction.options.getString('title');
      const local = interaction.options.getString('local');
      const supplied = [url, title, local].filter(v => v !== null).length;

      if (supplied === 0) {
        return interaction.reply({ content: 'You must supply **one** of: `url`, `title`, or `local`.', ephemeral: true });
      }
      if (supplied > 1) {
        return interaction.reply({ content: 'Please choose **only one** of: `url`, `title`, or `local`.', ephemeral: true });
      }

      if (!url && !title && !local) {
        return interaction.reply({ content: 'You must supply a **url** or a **title** or a **local**.', ephemeral: true });
      }

      play(url, title, local, interaction);
    }
  }
};