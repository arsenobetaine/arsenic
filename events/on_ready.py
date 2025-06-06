import discord

def on_ready_event(tree: discord.app_commands.CommandTree):
    async def on_ready():
        try:
            for cmd in tree.get_commands():
                print(f"[DEBUG] Registered command: /{cmd.name}")
            
            synced = await tree.sync()
            print(f"[INFO] Globally synced {len(synced)} command(s).")
        
        except discord.HTTPException as e:
            print(f"[ERROR] Failed to sync commands: {e}")

        activity = discord.Activity(type=discord.ActivityType.playing, name="Arsenic")
        await tree.client.change_presence(status=discord.Status.online, activity=activity)
        print(f"[READY] Bot is ready. Logged in as {tree.client.user}")
    return on_ready
