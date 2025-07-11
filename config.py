import os
from dotenv import load_dotenv

load_dotenv()

DISCORD_TOKEN = os.getenv("DISCORD_BOT_TOKEN")
AUTO_ROLE_ID = int(os.getenv("AUTO_ROLE_ID"))
PORT = int(os.getenv("PORT", 3000))

DEV_GUILD_ID = int(os.getenv("DEV_GUILD_ID", 0))
