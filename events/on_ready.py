import discord
from config import DEV_GUILD_ID

def on_ready_event(tree: discord.app_commands.CommandTree):
    async def on_ready():
        try:
            if DEV_GUILD_ID:
                guild = discord.Object(id=DEV_GUILD_ID)
                synced = await tree.sync(guild=guild)
                print(f"[INFO] Synced {len(synced)} commands to dev guild:")
                for cmd in synced:
                    print(f"  └─ /{cmd.name}")
            else:
                synced = await tree.sync()
                print(f"[INFO] Synced {len(synced)} global command(s):")
                for cmd in synced:
                    print(f"  └─ /{cmd.name}")
        except discord.HTTPException as e:
            print(f"[ERROR] Failed to sync commands: {e}")
        
        await tree.client.change_presence(
            status=discord.Status.online,
            activity=discord.Activity(type=discord.ActivityType.playing, name="Arsenic")
        )
        print(f"[READY] Bot is ready. Logged in as {tree.client.user}")
    return on_ready


