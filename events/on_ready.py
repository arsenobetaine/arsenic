import discord
from discord import app_commands, Activity, ActivityType

def on_ready_event(tree: app_commands.CommandTree, guild_id: int):
    async def on_ready():
        try:
            guild = discord.Object(id=guild_id)
            synced = await tree.sync(guild=guild)
            print(f"Synced {len(synced)} command(s) to guild {guild_id}.")
        except discord.HTTPException as e:
            print(f"[ERROR] Failed to sync commands: {e}")

        activity = discord.Activity(type=ActivityType.playing, name="Arsenic")
        await tree.client.change_presence(status=discord.Status.online, activity=activity)
        print(f"Bot is ready. Logged in as {tree.client.user}")

    return on_ready
