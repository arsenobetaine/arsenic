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

    // Helper to fetch and preserve Entry Point
    const preserveEntryPoint = async (commands) => {
      const entryPoint = commands.find(cmd => cmd.name === 'launch' || cmd.default_member_permissions === null); // Adjust criteria if needed (e.g., name 'launch')
      return entryPoint ? [entryPoint] : [];
    };

    // Fetch global commands and preserve Entry Point for global clear/update
    const globalCommands = await rest.get(Routes.applicationCommands(client.user.id));
    const globalPreserved = await preserveEntryPoint(globalCommands);

    // Clear global (but keep Entry Point)
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: globalPreserved } // Empty except Entry Point
    );
    console.log('Cleared global commands (preserving Entry Point).');

    // Fetch guild commands and preserve Entry Point for guild clear/update
    const guildCommands = await rest.get(Routes.applicationGuildCommands(client.user.id, guildId));
    const guildPreserved = await preserveEntryPoint(guildCommands);

    // Clear guild (but keep Entry Point)
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: guildPreserved }
    );
    console.log('Cleared guild commands (preserving Entry Point).');

    // Now register your new commands globally, appending preserved Entry Point
    await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: [...slashCommands, ...globalPreserved] }
    );

    // Register guild-specific, appending preserved Entry Point
    await rest.put(
      Routes.applicationGuildCommands(client.user.id, guildId),
      { body: [...slashCommands, ...guildPreserved] }
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
});
client.login(process.env.TOKEN);