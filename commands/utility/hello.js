const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello.'),
  async execute(interactionOrMessage) {
    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply('Hello!');
    } else {
      interactionOrMessage.channel.send('Hello!');
    }
  },
};