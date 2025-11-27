const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

// Load commands from all category folders.
function loadCommands(client, uncache = false) {
  client.commands.clear();
  const categoriesPath = path.join(__dirname, '../commands');
  const categories = fs.readdirSync(categoriesPath);

  for (const category of categories) {
    const commandsPath = path.join(categoriesPath, category);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      if (uncache) {
        delete require.cache[require.resolve(filePath)];
      }
      const command = require(filePath);
      client.commands.set(command.data.name, command);
    }
  }
}

// Register slash commands for the guild and globally.
async function registerCommands(client) {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const slashCommands = Array.from(client.commands.values()).map(cmd => cmd.data.toJSON());

  try {
    // Guild
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, client.config.guildId),
      { body: [] }
    );
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, client.config.guildId),
      { body: slashCommands }
    );
    console.log('Guild commands registered.');

    // Global
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashCommands }
    );
    console.log('Global commands registered (may take up to 1 hour to appear everywhere).');
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

module.exports = { loadCommands, registerCommands };