require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const config = require('./config');
const readline = require('readline');
const logger = require('./logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
client.commands = new Collection();
client.config = config;

// Top.gg auto-poster
if (process.env.TOPGG_TOKEN) {
  const poster = AutoPoster(process.env.TOPGG_TOKEN, client);
  poster.on('posted', () => logger.info('Posted stats to top.gg.'));
  poster.on('error', error => logger.error('Top.gg autoposter error:', error));
} else {
  logger.warn('TOPGG_TOKEN not set. Skipping top.gg stats posting.');
}

// Initial load
loadCommands(client, true);
loadEvents(client, true);

// Console input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});
rl.on('line', async (input) => {
  const trimmed = input.trim();
  if (trimmed === 'reload') {
    loadCommands(client, true);
    loadEvents(client, true);
    const slashCommandsJSON = JSON.stringify(Array.from(client.commands.values()).map(cmd => cmd.data.toJSON()));
    fs.writeFileSync(path.join(__dirname, 'commands.json'), slashCommandsJSON);
    logger.info(`Commands JSON for top.gg (reload): ${slashCommandsJSON}`);
    await registerCommands(client);
    logger.info('Commands and events reloaded.');
  } else if (trimmed === 'restart') {
    logger.info('Restarting bot...');
    process.exit(0);
  }
});

client.login(process.env.TOKEN);