module.exports = {
  name: 'guildMemberAdd',
  execute(member) {
    member.send('Welcome to the server!').catch(console.error);

    const botRoleId = '1377631351540289661';
    const memberRoleId = '1377631472785297449';
    const roleId = member.user.bot ? botRoleId : memberRoleId;

    member.roles.add(roleId).catch(console.error);
  }
};