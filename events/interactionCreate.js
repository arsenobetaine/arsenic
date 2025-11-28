const { MessageFlags } = require('discord.js');
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
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Error executing command.', flags: MessageFlags.Ephemeral });
      } else {
        await interaction.reply({ content: 'Error executing command.', flags: MessageFlags.Ephemeral });
      }
    }
  },
};