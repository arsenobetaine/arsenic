require('dotenv').config();
const { Client, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const config = require('./config');
const logger = require('./logger');

const client = new Client({ intents: [] });
client.commands = new Collection();
client.config = config;
client.user = { id: process.env.CLIENT_ID };

loadCommands(client);

const slashCommandsJSON = JSON.stringify(Array.from(client.commands.values()).map(cmd => cmd.data.toJSON()));

// Save/log for top.gg commands upload
fs.writeFileSync(path.join(__dirname, 'commands.json'), slashCommandsJSON);
logger.info(`Commands JSON for top.gg: ${slashCommandsJSON}`);

registerCommands(client)
  .then(() => {
    logger.info('Commands deployed successfully.');
    process.exit(0);
  })
  .catch(error => {
    logger.error('Error deploying commands:', error);
    process.exit(1);
  });