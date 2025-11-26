const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists available commands.'),
  async execute(interactionOrMessage, client) {
    const embed = new EmbedBuilder()
      .setTitle('Available Commands')
      .setColor(0x00FFFF);

    client.commands.forEach(cmd => {
      embed.addFields({ name: `/${cmd.data.name}`, value: cmd.data.description, inline: true });
    });

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ embeds: [embed] });
    } else {
      interactionOrMessage.channel.send({ embeds: [embed] });
    }
  },
};