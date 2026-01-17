# L'Ambassador School - Deployment Guide

## Server Details
- **IP:** 95.163.227.231
- **SSH Key:** ~/.ssh/bjora_key
- **Project Path:** /var/www/lambassador
- **Port:** 3001 (different from shop on port 3000)
- **PM2 Process Name:** lambassador

---

## Quick Deploy Commands

### 1. Copy files to server
```bash
# From your local machine (Windows PowerShell or Git Bash)
scp -i ~/.ssh/bjora_key -r ./* root@95.163.227.231:/var/www/lambassador/
```

### 2. SSH to server
```bash
ssh -i ~/.ssh/bjora_key root@95.163.227.231
```

### 3. Set up the application
```bash
# Create directory and logs folder
mkdir -p /var/www/lambassador/logs

# Navigate to project
cd /var/www/lambassador

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 config
pm2 save
```

---

## Full Deployment Script

Run this on your **local machine** to deploy:

```bash
#!/bin/bash

# Variables
SERVER="root@95.163.227.231"
KEY="~/.ssh/bjora_key"
REMOTE_PATH="/var/www/lambassador"

# Create remote directory
ssh -i $KEY $SERVER "mkdir -p $REMOTE_PATH/logs"

# Copy files (excluding unnecessary ones)
scp -i $KEY index.html $SERVER:$REMOTE_PATH/
scp -i $KEY styles.css $SERVER:$REMOTE_PATH/
scp -i $KEY script.js $SERVER:$REMOTE_PATH/
scp -i $KEY server.js $SERVER:$REMOTE_PATH/
scp -i $KEY package.json $SERVER:$REMOTE_PATH/
scp -i $KEY ecosystem.config.js $SERVER:$REMOTE_PATH/

# Start/Restart PM2 process
ssh -i $KEY $SERVER "cd $REMOTE_PATH && pm2 delete lambassador 2>/dev/null; pm2 start ecosystem.config.js && pm2 save"

echo "Deployment complete! Site available at http://95.163.227.231:3001"
```

---

## Nginx Configuration (Optional - for subdomain)

If you want to use a subdomain like `school.bjara.ru`, add this to Nginx:

```nginx
# /etc/nginx/sites-available/lambassador
server {
    listen 80;
    server_name school.bjara.ru;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:
```bash
# Enable site
ln -s /etc/nginx/sites-available/lambassador /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload nginx
systemctl reload nginx

# Add SSL with certbot
certbot --nginx -d school.bjara.ru
```

---

## Useful Commands

### PM2 Management
```bash
# View all processes
pm2 list

# View logs
pm2 logs lambassador

# Restart
pm2 restart lambassador

# Stop
pm2 stop lambassador

# Delete
pm2 delete lambassador
```

### Check if running
```bash
# Check port
curl http://localhost:3001

# Check from outside
curl http://95.163.227.231:3001
```

---

## Access URLs

- **Direct IP:** http://95.163.227.231:3001
- **With subdomain (after Nginx setup):** https://school.bjara.ru

---

## Notes

- The landing page runs on port **3001** to avoid conflict with the shop on port 3000
- Contact form submissions are logged to console (for production, integrate with email service)
- No database required - pure static site with Node.js server
