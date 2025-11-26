const { SlashCommandBuilder } = require('discord.js');
const { loadCommands, registerCommands } = require('../../handlers/commandHandler');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('reload')
    .setDescription('Reloads and registers commands.'),
  async execute(interactionOrMessage, client) {
    loadCommands(client);
    await registerCommands(client);

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply('Commands reloaded.');
    } else {
      interactionOrMessage.channel.send('Commands reloaded.');
    }
  },
};