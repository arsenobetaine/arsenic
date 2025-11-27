#!/bin/bash
# Install dependencies (already done by startup, but safe)
npm install

# Start with PM2 using the ecosystem config for watching/restarts
./node_modules/.bin/pm2-runtime deploy/ecosystem.config.js