const fs = require('fs');
const path = require('path');
const logger = require('../logger');

module.exports = {
  name: 'messageCreate',
  execute(client, message) {
    if (message.author.bot) return;

    const prefix = client.config.prefix;
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
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

    // Counting logic
    const dataPath = path.join(__dirname, '../data/count.json');
    const backupPath = `${dataPath}.bak`;
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
        fs.copyFileSync(dataPath, backupPath);  // Backup
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
        fs.copyFileSync(dataPath, backupPath);
        fs.writeFileSync(dataPath, JSON.stringify(countData));
        message.react('✅').catch(error => logger.error('Error reacting:', error));
      } catch (error) {
        logger.error('Error updating count:', error);
      }
    }
  },
};