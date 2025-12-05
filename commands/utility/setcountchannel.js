const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');  // Updated to PermissionFlagsBits (v14 standard)
const fs = require('fs');
const path = require('path');
const logger = require('../../logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setcountchannel')
    .setDescription('Sets the counting channel.')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel for counting.')
        .setRequired(true)),
  async execute(interactionOrMessage, client) {
    if (!interactionOrMessage.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const replyMsg = 'You need administrator permissions to use this command.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    const channel = interactionOrMessage.options?.getChannel('channel') || interactionOrMessage.mentions.channels.first();
    if (!channel || channel.type !== ChannelType.GuildText) {
      const replyMsg = 'Please specify a valid text channel.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    const dataPath = path.join(__dirname, '../../data/count.json');
    const backupPath = `${dataPath}.bak`;
    const countData = {
      channelId: channel.id,
      currentCount: 0,
      lastUserId: null,
      highScore: 0,
      userStats: {}
    };

    try {
      if (fs.existsSync(dataPath)) fs.copyFileSync(dataPath, backupPath);
      fs.writeFileSync(dataPath, JSON.stringify(countData));
      const replyMsg = `Counting channel set to ${channel.name}. Start counting from 1!`;
      interactionOrMessage.reply ? await interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
      logger.info(`Counting channel set to ${channel.id} by ${interactionOrMessage.member.user.tag}`);
    } catch (error) {
      logger.error('Error setting counting channel:', error);
      const errorMsg = 'Error setting counting channel.';
      interactionOrMessage.reply ? await interactionOrMessage.reply(errorMsg) : interactionOrMessage.channel.send(errorMsg);
    }
  },
};