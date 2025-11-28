const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists available commands.'),
  async execute(interactionOrMessage, client) {
    const embed = new EmbedBuilder()
      .setTitle('Arsenic Bot Commands')
      .setDescription('Here\'s a list of all available commands. Use `/` for slash commands or the prefix for text commands.')
      .setColor(0x5865F2)
      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `Bot version: ${require('../../package.json').version} | Use ${client.config.prefix}help for prefixed version` })
      .setTimestamp();

    client.commands.forEach(cmd => {
      embed.addFields({ name: `/${cmd.data.name}`, value: cmd.data.description || 'No description available', inline: true });
    });

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ embeds: [embed] });
    } else {
      interactionOrMessage.channel.send({ embeds: [embed] });
    }
  },
};