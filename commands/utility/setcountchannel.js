const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setcountchannel')
    .setDescription('Sets the counting channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel for counting.')
        .setRequired(true)),
  async execute(interactionOrMessage, client) {
    const channel = interactionOrMessage.options?.getChannel('channel') || interactionOrMessage.mentions.channels.first();

    if (!channel) {
      return interactionOrMessage.reply ? interactionOrMessage.reply('Specify a channel.') : interactionOrMessage.channel.send('Specify a channel.');
    }

    const dataPath = path.join(__dirname, '../../data/count.json');
    const countData = { channelId: channel.id, currentCount: 0, lastUserId: null };
    fs.writeFileSync(dataPath, JSON.stringify(countData));

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply(`Counting channel set to ${channel.name}.`);
    } else {
      interactionOrMessage.channel.send(`Counting channel set to ${channel.name}.`);
    }
  },
};