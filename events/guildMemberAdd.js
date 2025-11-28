const logger = require('../logger');

module.exports = {
  name: 'guildMemberAdd',
  execute(client, member) {
    member.send('Welcome to the server!').catch(error => logger.error('Error sending welcome:', error));
    const roleId = member.user.bot ? client.config.botRoleId : client.config.memberRoleId;
    member.roles.add(roleId).catch(error => logger.error('Error adding role:', error));
    logger.info(`New member: ${member.user.tag}`);
  },
};