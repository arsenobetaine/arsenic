const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Says goodbye.'),
  async execute(interactionOrMessage, client) {
    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply('Goodbye!');
    } else {
      interactionOrMessage.channel.send('Goodbye!');
    }
  },
};