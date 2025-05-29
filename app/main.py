import os
import discord
from discord import app_commands
from flask import Flask
import threading

# --- Discord Client Setup ---
intents = discord.Intents.default()
client = discord.Client(intents=intents)
tree = app_commands.CommandTree(client)

# --- Slash Command ---
@tree.command(name="hello", description="Say hello!")
async def hello_command(interaction: discord.Interaction):
    await interaction.response.send_message("Hello!")

@client.event
async def on_ready():
    await tree.sync()
    print(f"Bot is ready. Logged in as {client.user}")

# --- Flask Keep-Alive Server ---
app = Flask(__name__)

@app.route('/')
def home():
    return "Bot is running!"

def run_flask():
    port = int(os.environ.get("PORT", 3000))
    app.run(host="0.0.0.0", port=port)

def keep_alive():
    thread = threading.Thread(target=run_flask)
    thread.start()

# --- Start Everything ---
keep_alive()
client.run(os.getenv("TOKEN"))
