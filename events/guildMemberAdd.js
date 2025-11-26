module.exports = {
  name: 'guildMemberAdd',
  execute(client, member) {
    member.send('Welcome to the server!').catch(console.error);
    const roleId = member.user.bot ? client.config.botRoleId : client.config.memberRoleId;
    member.roles.add(roleId).catch(console.error);
  },
};