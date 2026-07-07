const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'config.json');
const DEFAULT_ADMIN_PASSWORD = 'admin1234';

let cachedConfig = load();

function load() {
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch (err) {
    console.error(`Failed to load config.json: ${err.message}`);
    process.exit(1);
  }

  if (!parsed.backend?.adminPassword || parsed.backend.adminPassword === DEFAULT_ADMIN_PASSWORD) {
    console.error(
      'config.json still has the default admin password. Set backend.adminPassword to something unique before starting the server.'
    );
    process.exit(1);
  }

  return parsed;
}

function reload() {
  cachedConfig = load();
  return cachedConfig;
}

function get() {
  return cachedConfig;
}

function writePartial(mutator) {
  const raw = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  mutator(raw);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(raw, null, 2), 'utf8');
  return reload();
}

module.exports = { get, reload, writePartial, CONFIG_PATH };
