const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../../logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unsetcountchannel')
    .setDescription('Removes the current counting channel.'),
  async execute(interactionOrMessage, client) {
    if (!interactionOrMessage.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      const replyMsg = 'You need administrator permissions to use this command.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    const dataPath = path.join(__dirname, '../../data/count.json');

    if (!fs.existsSync(dataPath)) {
      const replyMsg = 'No counting channel is currently set.';
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(replyMsg);
      } else {
        interactionOrMessage.channel.send(replyMsg);
      }
      return;
    }

    try {
      fs.unlinkSync(dataPath);
      const replyMsg = 'Counting channel removed. Counting is now disabled.';
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(replyMsg);
      } else {
        interactionOrMessage.channel.send(replyMsg);
      }
      logger.info(`Counting channel unset by ${interactionOrMessage.member.user.tag}`);
    } catch (error) {
      logger.error('Error removing counting channel:', error);
      const errorMsg = 'Error removing counting channel.';
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(errorMsg);
      } else {
        interactionOrMessage.channel.send(errorMsg);
      }
    }
  },
};