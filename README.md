# Arsenic Bot

A bot that makes breathing easier.

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` with your TOKEN and GUILD_ID.
3. Run locally: `npm start`
4. Deploy commands: `npm run deploy` (registers slash commands without starting the bot)

## Features

- Basic greetings.
- Member welcome and role assignment.
- Counting game in designated channel with high scores and leaderboard.
- Help command for command list.
- Server and user info utilities.
- Admin commands for counting setup (requires admin permissions).

## Development

Add commands to `commands/<category>/`. In the console, type 'reload' to update commands without restarting the bot. Type 'restart' to trigger a full bot restart (host will handle it automatically).
Logs are in `combined.log` and `error.log`.