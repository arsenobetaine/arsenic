import discord
from discord import app_commands, Activity, ActivityType

def on_ready_event(tree: app_commands.CommandTree):
    async def on_ready():
        try:
            synced = await tree.sync()  # only for global cmds
            print(f"Synced {len(synced)} command(s) globally.")
        except discord.HTTPException as e:
            print(f"[ERROR] Failed to sync commands: {e}")

        activity = discord.Activity(type=ActivityType.playing, name="Arsenic")
        await tree.client.change_presence(status=discord.Status.online, activity=activity)
        print(f"Bot is ready. Logged in as {tree.client.user}")

    return on_ready
