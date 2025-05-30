import discord
from discord import Activity, ActivityType

def on_ready_event(tree):
    async def on_ready():
        await tree.sync()
        print(f"Bot is ready. Logged in as {tree.client.user}")

        # Set status
        activity = Activity(type=ActivityType.playing, name="Arsenic")
        await tree.client.change_presence(status=discord.Status.online, activity=activity)

    return on_ready
