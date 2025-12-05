const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../../logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unsetcountchannel')
    .setDescription('Removes the current counting channel.'),
  async execute(interactionOrMessage) {
    if (!interactionOrMessage.member.permissions.has(PermissionFlagsBits.Administrator)) {
      const replyMsg = 'You need administrator permissions to use this command.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    const dataPath = path.join(__dirname, '../../data/count.json');
    const backupPath = `${dataPath}.bak`;
    if (!fs.existsSync(dataPath)) {
      const replyMsg = 'No counting channel is currently set.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    try {
      fs.copyFileSync(dataPath, backupPath);
      fs.unlinkSync(dataPath);
      const replyMsg = 'Counting channel removed. Counting is now disabled.';
      interactionOrMessage.reply ? await interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
      logger.info(`Counting channel unset by ${interactionOrMessage.member.user.tag}`);
    } catch (error) {
      logger.error('Error removing counting channel:', error);
      const errorMsg = 'Error removing counting channel.';
      interactionOrMessage.reply ? await interactionOrMessage.reply(errorMsg) : interactionOrMessage.channel.send(errorMsg);
    }
  },
};