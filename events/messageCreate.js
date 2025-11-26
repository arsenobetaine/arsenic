const fs = require('fs');
const path = require('path');

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
        console.error(error);
        message.reply('Error executing command.').catch(console.error);
      }
      return;
    }

    // Handle counting.
    const dataPath = path.join(__dirname, '../data/count.json');
    if (!fs.existsSync(dataPath)) return;

    const countData = JSON.parse(fs.readFileSync(dataPath));
    if (message.channel.id !== countData.channelId) return;

    const number = parseInt(message.content.trim(), 10);
    if (isNaN(number) || number !== countData.currentCount + 1 || message.author.id === countData.lastUserId) {
      message.delete().catch(console.error);
      countData.currentCount = 0;
      countData.lastUserId = null;
      fs.writeFileSync(dataPath, JSON.stringify(countData));
      message.channel.send('Wrong count! Reset to 0.').catch(console.error);
    } else {
      countData.currentCount = number;
      countData.lastUserId = message.author.id;
      fs.writeFileSync(dataPath, JSON.stringify(countData));
      message.react('✅').catch(console.error);
    }
  },
};