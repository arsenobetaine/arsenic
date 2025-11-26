require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { loadCommands, registerCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const config = require('./config');

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

client.login(process.env.TOKEN);