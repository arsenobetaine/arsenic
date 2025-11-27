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

// Console input for reload.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', async (input) => {
  if (input.trim() === 'reload') {
    loadCommands(client);
    await registerCommands(client);
    console.log('Commands reloaded.');
  }
});

client.login(process.env.TOKEN);