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
GUILD_ID = int(os.getenv("GUILD_ID"))

# Setup client
intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

# Register events
client.event(on_ready_event(tree, GUILD_ID))
client.event(on_member_join_event(ROLE_ID))

# Slash command (registered only to the guild in on_ready)
tree.command(name="hello", description="Say hello!")(hello_command)
tree.command(name="purge", description="Delete all messages in this channel.")(purge_command)

# Start bot
keep_alive()
client.run(TOKEN)
