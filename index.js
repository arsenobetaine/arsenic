require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const config = require('./config');
const readline = require('readline');

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

// Initial load and registration.
loadCommands(client);
loadEvents(client);

// Console input for commands.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (input) => {
  const trimmed = input.trim();
  if (trimmed === 'reload') {
    loadCommands(client);
    await registerCommands(client);
    console.log('Commands reloaded.');
  } else if (trimmed === 'restart') {
    console.log('Restarting bot...');
    process.exit(0);
  }
});

client.login(process.env.TOKEN);