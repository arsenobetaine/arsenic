# Arsenic Bot

A bot that makes breathing easier.

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` with your TOKEN and GUILD_ID.
3. Run locally: `npm start`
4. For production with zero-downtime: Install PM2 globally if needed (`npm i -g pm2`), then `npm run deploy`. PM2 watches for file changes and restarts seamlessly.

## Features

- Basic greetings.
- Member welcome and role assignment.
- Counting game in designated channel.
- Help command for command list.
- Reload command for live updates.

## Development

Add commands to `commands/<category>/`. Use `/reload` to update without restart.