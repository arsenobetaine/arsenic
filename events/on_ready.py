import discord
from config import DEV_GUILD_ID

def on_ready_event(tree: discord.app_commands.CommandTree):
    async def on_ready():
        try:
            if DEV_GUILD_ID:
                guild = discord.Object(id=DEV_GUILD_ID)
                # ONLY sync to guild; do NOT copy global commands
                synced = await tree.sync(guild=guild)
                print(f"[INFO] Synced {len(synced)} commands to DEV guild.")
            else:
                synced = await tree.sync()
                print(f"[INFO] Synced {len(synced)} commands globally.")
        except discord.HTTPException as e:
            print(f"[ERROR] Failed to sync commands: {e}")

        activity = discord.Activity(type=discord.ActivityType.playing, name="Arsenic")
        await tree.client.change_presence(status=discord.Status.online, activity=activity)
        print(f"[READY] Bot is ready. Logged in as {tree.client.user}")
    return on_ready

