require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, REST, Routes, ActivityType, SlashCommandBuilder } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.prefix = process.env.PREFIX || 'As.';

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const slashCommands = []; // For registration

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
  slashCommands.push(command.data.toJSON());
}

// Load events
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

// Handle prefixed commands
client.on('messageCreate', message => {
  if (!message.content.startsWith(client.prefix) || message.author.bot) return;

  const args = message.content.slice(client.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName)
    || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('There was an error executing that command!').catch(console.error);
  }
});

// Handle slash commands
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Register slash commands on ready (global; for guild-specific, use guildId)
client.once('ready', async () => {
  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
  const guildId = '1374983792707764294'; // Replace with your server ID

  try {
    console.log('Started clearing and refreshing application (/) commands.');

    // Clear all global commands (set to empty array)
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: [] }
    );
    console.log('Cleared all global commands.');

    // Clear all guild-specific commands (set to empty array)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: [] }
    );
    console.log('Cleared all guild commands.');

    // Now register your new commands globally (up to 1 hour to propagate)
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: slashCommands }
    );

    // Also register guild-specific (instant in your server)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: slashCommands }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});

client.login(process.env.TOKEN);