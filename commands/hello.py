import discord

async def hello_command(interaction: discord.Interaction):
    await interaction.response.send_message("I'm a femboy kitten UwU! (psst... I also eat dogs.)", ephemeral=True)
