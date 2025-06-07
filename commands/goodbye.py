import discord

async def goodbye_command(interaction: discord.Interaction):
    await interaction.response.send_message("Noooooo, don't leave me! ;-;", ephemeral=True)
