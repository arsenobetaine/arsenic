const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays server information.'),
  async execute(interactionOrMessage, client) {
    const guild = interactionOrMessage.guild;

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} Info`)
      .setThumbnail(guild.iconURL({ dynamic: true }))
      .setColor(0x5865F2)
      .addFields(
        { name: 'Owner', value: (await guild.fetchOwner()).user.tag, inline: true },
        { name: 'Members', value: `${guild.memberCount}`, inline: true },
        { name: 'Channels', value: `${guild.channels.cache.size}`, inline: true },
        { name: 'Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: 'Created At', value: guild.createdAt.toDateString(), inline: true }
      );

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ embeds: [embed] });
    } else {
      interactionOrMessage.channel.send({ embeds: [embed] });
    }
  },
};