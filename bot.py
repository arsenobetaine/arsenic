import os
import discord
from discord.ext import commands
from discord import app_commands

from keep_alive import keep_alive
from events.on_ready import on_ready_event
from events.on_member_join import on_member_join_event
from commands.hello import hello_command
from commands.purge import purge_command

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

# Register global slash commands
@tree.command(name="hello", description="Say hello!", dm_permission=True)
async def wrapped_hello_command(interaction: discord.Interaction):
    await hello_command(interaction)

@tree.command(name="purge", description="Delete all messages in this channel.", dm_permission=False)
async def wrapped_purge_command(interaction: discord.Interaction):
    await purge_command(interaction)

# Start bot
keep_alive()
client.run(TOKEN)
