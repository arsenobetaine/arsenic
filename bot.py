import os
import discord
from discord.ext import commands
from discord import app_commands

from keep_alive import keep_alive
from config import DISCORD_TOKEN, AUTO_ROLE_ID
from events.on_ready import on_ready_event
from events.on_member_join import on_member_join_event
from commands.hello import hello_command
from commands.goodbye import goodbye_command

intents = discord.Intents.default()
intents.members = True

client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

# Register events
client.event(on_ready_event(tree))
client.event(on_member_join_event(AUTO_ROLE_ID))

# Register commands
tree.command(name="hello", description="Say hello!")(hello_command)
tree.command(name="goodbye", description="Say goodbye!")(goodbye_command)

# Start everything
keep_alive()
client.run(DISCORD_TOKEN)
