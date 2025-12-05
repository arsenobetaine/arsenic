const { InteractionResponseFlags } = require('discord.js');
const logger = require('../logger');

module.exports = {
  name: 'interactionCreate',
  async execute(client, interaction) {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, client);
    } catch (error) {
      logger.error('Error executing interaction:', error);
      const errorMsg = { content: 'Error executing command.', flags: InteractionResponseFlags.Ephemeral };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(errorMsg);
      } else {
        await interaction.reply(errorMsg);
      }
    }
  },
};