const { ActivityType } = require('discord.js');
const { registerCommands } = require('../handlers/commandHandler');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity(`${client.config.prefix}help`, { type: ActivityType.Listening });
    await registerCommands(client);
  },
};