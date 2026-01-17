module.exports = {
  apps: [{
    name: 'lambassador',
    script: 'server.js',
    cwd: '/var/www/lambassador',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/www/lambassador/logs/error.log',
    out_file: '/var/www/lambassador/logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
