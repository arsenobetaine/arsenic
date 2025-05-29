import os
import discord
from discord.ext import commands
from flask import Flask
import threading

# --- Discord Bot Setup ---
intents = discord.Intents.default()
intents.message_content = True

bot = commands.Bot(command_prefix="!", intents=intents)

@bot.event
async def on_ready():
    print(f"Bot is ready. Logged in as {bot.user}")

@bot.command()
async def ping(ctx):
    await ctx.send("Pong!")

# --- Flask Keep-Alive Server ---
app = Flask(__name__)

@app.route('/')
def home():
    return "Bot is running!"

def run():
    port = int(os.environ.get("PORT", 3000))
    print(f"Starting web server on port {port}...")
    app.run(host="0.0.0.0", port=port)

def keep_alive():
    t = threading.Thread(target=run)
    t.start()

# --- Start Flask and Discord Bot ---
keep_alive()
bot.run(os.getenv("DISCORD_BOT_TOKEN"))
