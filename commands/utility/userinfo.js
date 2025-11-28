const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setDescription('Displays user information.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to get info for.')
        .setRequired(false)),
  async execute(interactionOrMessage, client) {
    const user = interactionOrMessage.options?.getUser('user') || interactionOrMessage.mentions.users.first() || interactionOrMessage.author || interactionOrMessage.user;
    const member = await interactionOrMessage.guild.members.fetch(user.id);

    const embed = new EmbedBuilder()
      .setTitle(`${user.tag} Info`)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setColor(0x5865F2)
      .addFields(
        { name: 'ID', value: user.id, inline: true },
        { name: 'Joined Server', value: member.joinedAt.toDateString(), inline: true },
        { name: 'Account Created', value: user.createdAt.toDateString(), inline: true },
        { name: 'Roles', value: member.roles.cache.map(role => role.name).join(', ') || 'None', inline: false }
      );

    if (interactionOrMessage.reply) {
      await interactionOrMessage.reply({ embeds: [embed] });
    } else {
      interactionOrMessage.channel.send({ embeds: [embed] });
    }
  },
};