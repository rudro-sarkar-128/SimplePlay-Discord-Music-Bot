const { Events } = require('discord.js');

const { notice_channel } = require('../config.json');

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    client.channels.fetch(notice_channel)
                    .then(ch => ch.isTextBased() && ch.send(`${client.user.tag} has become active!`))
                    .catch(() => { });
  }
};

