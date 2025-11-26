const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Says goodbye.'),
  async execute(interactionOrMessage) {
    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply('Goodbye!');
    } else {
      interactionOrMessage.channel.send('Goodbye!');
    }
  },
};