const { SlashCommandBuilder, ChannelType, PermissionsBitField } = require('discord.js');
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
    if (!interactionOrMessage.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const replyMsg = 'You need administrator permissions to use this command.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    const channel = interactionOrMessage.options?.getChannel('channel') || interactionOrMessage.mentions.channels.first();

    if (!channel || channel.type !== ChannelType.GuildText) { // 0 in v14 enums
      return interactionOrMessage.reply ? interactionOrMessage.reply('Please specify a valid text channel.') : interactionOrMessage.channel.send('Please specify a valid text channel.');
    }

    const dataPath = path.join(__dirname, '../../data/count.json');
    const countData = { 
      channelId: channel.id, 
      currentCount: 0, 
      lastUserId: null,
      highScore: 0,
      userStats: {}
    };

    try {
      fs.writeFileSync(dataPath, JSON.stringify(countData));
      const replyMsg = `Counting channel set to ${channel.name}. Start counting from 1!`;
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(replyMsg);
      } else {
        interactionOrMessage.channel.send(replyMsg);
      }
      logger.info(`Counting channel set to ${channel.id} by ${interactionOrMessage.member.user.tag}`);
    } catch (error) {
      logger.error('Error setting counting channel:', error);
      const errorMsg = 'Error setting counting channel.';
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(errorMsg);
      } else {
        interactionOrMessage.channel.send(errorMsg);
      }
    }
  },
};