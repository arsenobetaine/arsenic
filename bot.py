import os
import discord
from discord.ext import commands
from discord import app_commands

from keep_alive import keep_alive
from events.on_ready import on_ready_event
from events.on_member_join import on_member_join_event

TOKEN = os.getenv("DISCORD_BOT_TOKEN")
ROLE_ID = int(os.getenv("AUTO_ROLE_ID"))

# Setup client
intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

# Register events
client.event(on_ready_event(tree))
client.event(on_member_join_event(ROLE_ID))

# Define a command group with correct dm_permission
class GlobalCommands(app_commands.Group):
    @app_commands.command(
        name="hello",
        description="Say hello!",
        # ✅ This will allow DMs in supported versions
    )
    async def hello(self, interaction: discord.Interaction):
        await interaction.response.send_message("Hello from DMs or server!", ephemeral=True)

    @app_commands.command(
        name="purge",
        description="Delete all messages in this channel.",
    )
    async def purge(self, interaction: discord.Interaction):
        # Prevent use in DMs
        if interaction.guild is None:
            await interaction.response.send_message("This command can't be used in DMs.", ephemeral=True)
            return
        await interaction.channel.purge()
        await interaction.response.send_message("Messages deleted.", ephemeral=True)

tree.add_command(GlobalCommands(name=""))  # Registers hello and purge as global commands

# Start bot
keep_alive()
client.run(TOKEN)
