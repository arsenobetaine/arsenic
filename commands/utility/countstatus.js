const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const logger = require('../../logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('countstatus')
    .setDescription('Shows the current counting status, high score, and leaderboard.'),
  async execute(interactionOrMessage, client) {
    const dataPath = path.join(__dirname, '../../data/count.json');
    if (!fs.existsSync(dataPath)) {
      const replyMsg = 'No counting channel is set.';
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(replyMsg);
      } else {
        interactionOrMessage.channel.send(replyMsg);
      }
      return;
    }

    let countData;
    try {
      countData = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) {
      logger.error('Error reading count data:', error);
      const errorMsg = 'Error fetching count status.';
      if (interactionOrMessage.reply) {
        await interactionOrMessage.reply(errorMsg);
      } else {
        interactionOrMessage.channel.send(errorMsg);
      }
      return;
    }

    const channel = client.channels.cache.get(countData.channelId);
    const lastUser = countData.lastUserId ? await client.users.fetch(countData.lastUserId).catch(() => null) : null;

    // Leaderboard: Top 5 users
    const userStats = countData.userStats || {};
    const sortedUsers = Object.entries(userStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const leaderboardFields = await Promise.all(sortedUsers.map(async ([userId, count]) => {
      const user = await client.users.fetch(userId).catch(() => ({ tag: 'Unknown User' }));
      return { name: user.tag, value: `${count} successful counts`, inline: true };
    }));

    const embed = new EmbedBuilder()
      .setTitle('Counting Status')
      .setColor(0x5865F2)
      .addFields(
        { name: 'Current Count', value: `${countData.currentCount}`, inline: true },
        { name: 'High Score', value: `${countData.highScore || 0}`, inline: true },
        { name: 'Counting Channel', value: channel ? channel.name : 'Unknown', inline: true },
        { name: 'Last Counter', value: lastUser ? lastUser.tag : 'None', inline: true }
      )
      .addFields({ name: '\u200B', value: '**Leaderboard (Top 5)**' })
      .addFields(...leaderboardFields);

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ embeds: [embed] });
    } else {
      interactionOrMessage.channel.send({ embeds: [embed] });
    }
  },
};