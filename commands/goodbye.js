const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Says goodbye'),
  async execute(interactionOrMessage, args) {
    if (interactionOrMessage.reply) { // Slash interaction
      await interactionOrMessage.reply('Goodbye!');
    } else { // Prefix message
      interactionOrMessage.channel.send('Goodbye!');
    }
  }
};