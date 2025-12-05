const fs = require('fs');
const path = require('path');
const logger = require('../logger');

module.exports = {
  name: 'messageCreate',
  execute(client, message) {
    if (message.author.bot) return;

    // Handle prefixed commands.
    if (message.content.startsWith(client.config.prefix)) {
      const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const command = client.commands.get(commandName);
      if (!command) return;

      try {
        command.execute(message, client);
      } catch (error) {
        logger.error('Error executing prefixed command:', error);
        message.reply('Error executing command.').catch(error => logger.error('Error replying:', error));
      }
      return;
    }

    // Handle counting.
    const dataPath = path.join(__dirname, '../data/count.json');
    if (!fs.existsSync(dataPath)) return;

    let countData;
    try {
      countData = JSON.parse(fs.readFileSync(dataPath));
    } catch (error) {
      logger.error('Error reading count data:', error);
      return;
    }

    if (message.channel.id !== countData.channelId) return;

    const number = parseInt(message.content.trim(), 10);
    if (isNaN(number) || number !== countData.currentCount + 1 || message.author.id === countData.lastUserId) {
      message.delete().catch(error => logger.error('Error deleting message:', error));
      if (countData.currentCount > (countData.highScore || 0)) {
        countData.highScore = countData.currentCount;
      }
      countData.currentCount = 0;
      countData.lastUserId = null;
      try {
        fs.writeFileSync(dataPath, JSON.stringify(countData));
        message.channel.send('Wrong count! Reset to 0.').catch(error => logger.error('Error sending reset message:', error));
      } catch (error) {
        logger.error('Error resetting count:', error);
      }
    } else {
      countData.currentCount = number;
      countData.lastUserId = message.author.id;
      if (!countData.userStats) countData.userStats = {};
      countData.userStats[message.author.id] = (countData.userStats[message.author.id] || 0) + 1;
      if (number > (countData.highScore || 0)) {
        countData.highScore = number;
      }
      try {
        fs.writeFileSync(dataPath, JSON.stringify(countData));
        message.react('✅').catch(error => logger.error('Error reacting:', error));
      } catch (error) {
        logger.error('Error updating count:', error);
      }
    }
  },
};