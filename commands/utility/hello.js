const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Says hello.'),
  async execute(interactionOrMessage) {
    const replyMsg = 'Hello!';
    interactionOrMessage.reply ? await interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
  },
};