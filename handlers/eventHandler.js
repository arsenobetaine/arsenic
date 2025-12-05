const fs = require('fs');
const path = require('path');
const logger = require('../logger');

// Load event listeners.
function loadEvents(client, uncache = false) {
  const eventsPath = path.join(__dirname, '../events');
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  let loadedCount = 0;

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    if (uncache) delete require.cache[require.resolve(filePath)];
    const event = require(filePath);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(client, ...args));
    } else {
      client.on(event.name, (...args) => event.execute(client, ...args));
    }
    loadedCount++;
  }
  logger.info(`Loaded ${loadedCount} events.`);
}

module.exports = { loadEvents };