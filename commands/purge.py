async def purge_command(interaction):
    if not interaction.user.guild_permissions.manage_messages:
        await interaction.response.send_message("You don't have permission to use this command.", ephemeral=True)
        return

    await interaction.response.defer(ephemeral=True)  # Acknowledge the command

    try:
        deleted = await interaction.channel.purge()
        await interaction.followup.send(f"Deleted {len(deleted)} messages.", ephemeral=True)
    except Exception as e:
        await interaction.followup.send(f"Error: {str(e)}", ephemeral=True)
