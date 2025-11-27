module.exports = {
  apps: [{
    name: 'arsenic-bot',
    script: './index.js',
    watch: true,
    ignore_watch: ['node_modules', 'data'],
    exec_mode: 'fork',
    instances: 1,
    env: {
      NODE_ENV: 'production',
    },
  }],
};