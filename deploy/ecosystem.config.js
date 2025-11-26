module.exports = {
  apps: [{
    name: 'arsenic-bot',
    script: './index.js',
    watch: true,
    ignore_watch: ['node_modules', 'data'],
    env: {
      NODE_ENV: 'production',
    },
  }],
};