const { ActivityType } = require('discord.js');
const { registerCommands } = require('../handlers/commandHandler');
const logger = require('../logger');

module.exports = {
  name: 'clientReady',
  once: true,
  async execute(client) {
    logger.info(`Logged in as ${client.user.tag}`);
    client.user.setActivity(`${client.config.prefix}help`, { type: ActivityType.Listening });
    await registerCommands(client);
  },
};