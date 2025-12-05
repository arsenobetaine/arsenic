const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('goodbye')
    .setDescription('Says goodbye.'),
  async execute(interactionOrMessage) {
    const replyMsg = 'Goodbye!';
    interactionOrMessage.reply ? await interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
  },
};