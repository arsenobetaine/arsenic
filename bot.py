import os
import discord
from discord.ext import commands

from keep_alive import keep_alive
from utils.setup_tree import setup_tree
from events.on_ready import on_ready_event
from events.on_member_join import on_member_join_event
from commands.hello import hello_command

TOKEN = os.getenv("DISCORD_BOT_TOKEN")
GUILD_ID = int(os.getenv("GUILD_ID"))
ROLE_ID = int(os.getenv("AUTO_ROLE_ID"))

intents = discord.Intents.default()
intents.members = True
client = discord.Client(intents=intents)
tree = discord.app_commands.CommandTree(client)

client.event(on_ready_event(tree))
client.event(on_member_join_event(ROLE_ID))

tree.command(name="hello", description="Say hello!")(hello_command)

keep_alive()
client.run(TOKEN)
