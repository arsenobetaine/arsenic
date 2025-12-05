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
      return interactionOrMessage.reply ? interactionOrMessage.reply(replyMsg) : interactionOrMessage.channel.send(replyMsg);
    }

    let countData;
    try {
      countData = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) {
      logger.error('Error reading count data:', error);
      const errorMsg = 'Error fetching count status.';
      return interactionOrMessage.reply ? interactionOrMessage.reply(errorMsg) : interactionOrMessage.channel.send(errorMsg);
    }

    const channel = client.channels.cache.get(countData.channelId);
    const lastUser = countData.lastUserId ? await client.users.fetch(countData.lastUserId, { cache: true }).catch(() => null) : null;

    const userStats = countData.userStats || {};
    const sortedUsers = Object.entries(userStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    const leaderboardFields = sortedUsers.length > 0
      ? await Promise.all(sortedUsers.map(async ([userId, count]) => {
          const user = await client.users.fetch(userId, { cache: true }).catch(() => ({ tag: 'Unknown User' }));
          return { name: user.tag, value: `${count} successful counts`, inline: true };
        }))
      : [{ name: 'No Data', value: 'No counts yet.', inline: true }];

    const embed = new EmbedBuilder()
      .setTitle('Counting Status')
      .setColor(0x5865F2)
      .addFields(
        { name: 'Current Count', value: `${countData.currentCount || 0}`, inline: true },
        { name: 'High Score', value: `${countData.highScore || 0}`, inline: true },
        { name: 'Counting Channel', value: channel ? channel.name : 'Unknown', inline: true },
        { name: 'Last Counter', value: lastUser ? lastUser.tag : 'None', inline: true }
      )
      .addFields({ name: '\u200B', value: '**Leaderboard (Top 5)**' })
      .addFields(...leaderboardFields);

    interactionOrMessage.reply ? await interactionOrMessage.reply({ embeds: [embed] }) : interactionOrMessage.channel.send({ embeds: [embed] });
  },
};