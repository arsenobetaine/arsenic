require('dotenv').config();
const { Client, Collection } = require('discord.js');
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const config = require('./config');
const logger = require('./logger');

const client = new Client({ intents: [] });
client.commands = new Collection();
client.config = config;
client.user = { id: process.env.CLIENT_ID};

loadCommands(client);
registerCommands(client).then(() => {
  logger.info('Commands deployed successfully.');
  process.exit(0);
}).catch(error => {
  logger.error('Error deploying commands:', error);
  process.exit(1);
});