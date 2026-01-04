# AI Coding Assistant - Deployment Guide

Complete guide to deploy the AI Coding Assistant to your server (88.222.214.9) and make it accessible at ai-coder.gleuhr.com.

## Prerequisites

- Server with Docker and Docker Compose installed
- Domain name (ai-coder.gleuhr.com) pointing to your server IP
- SSH access to the server
- SSL certificate (we'll use Let's Encrypt)

## Deployment Steps

### 1. Connect to Your Server

```bash
ssh root@88.222.214.9
```

### 2. Install Docker and Docker Compose (if not already installed)

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Start Docker service
systemctl start docker
systemctl enable docker
```

### 3. Install Nginx (for reverse proxy)

```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

### 4. Install Certbot for SSL

```bash
apt install certbot python3-certbot-nginx -y

# Get SSL certificate
certbot --nginx -d ai-coder.gleuhr.com

# Certificate will auto-renew
```

### 5. Clone or Upload the Project

```bash
# Create directory
mkdir -p /var/www/ai-coding-assistant
cd /var/www/ai-coding-assistant

# Upload your project files here
# You can use scp, git, or rsync
```

If using git:
```bash
git clone <your-repo-url> .
```

If using scp from your local machine:
```bash
scp -r /path/to/Ai-Coding-Assistant root@88.222.214.9:/var/www/ai-coding-assistant
```

### 6. Configure Environment Variables

```bash
cd /var/www/ai-coding-assistant

# Backend environment is already configured in backend/.env
# Verify it contains:
cat backend/.env
```

Should contain:
```
ANTHROPIC_API_KEY=your_actual_anthropic_api_key_here
JWT_SECRET=your_strong_jwt_secret_here
MONGODB_URI=mongodb://mongodb:27017/ai-coding-assistant
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://ai-coder.gleuhr.com
```

**Note**: Replace `your_actual_anthropic_api_key_here` with your actual Anthropic API key, and generate a strong random string for `JWT_SECRET`.

### 7. Configure Nginx

```bash
# Copy nginx configuration
cp nginx-server.conf /etc/nginx/sites-available/ai-coder.gleuhr.com

# Create symbolic link
ln -s /etc/nginx/sites-available/ai-coder.gleuhr.com /etc/nginx/sites-enabled/

# Remove default nginx site if it exists
rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
nginx -t

# Reload nginx
systemctl reload nginx
```

### 8. Start the Application with Docker Compose

```bash
cd /var/www/ai-coding-assistant

# Build and start all services
docker-compose up -d --build

# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f
```

### 9. Verify Deployment

1. **Check if services are running:**
```bash
docker-compose ps
```

You should see:
- ai-coder-mongodb (running)
- ai-coder-backend (running)
- ai-coder-frontend (running)

2. **Test API endpoint:**
```bash
curl http://localhost:5000/api/health
```

3. **Access the application:**
Open your browser and go to: https://ai-coder.gleuhr.com

## Post-Deployment

### Monitor Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
```

### Stop Services

```bash
docker-compose stop
```

### Update Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Backup Database

```bash
# Backup MongoDB
docker exec ai-coder-mongodb mongodump --out /data/backup

# Copy backup to host
docker cp ai-coder-mongodb:/data/backup ./mongodb-backup-$(date +%Y%m%d)
```

### Restore Database

```bash
# Copy backup to container
docker cp ./mongodb-backup ai-coder-mongodb:/data/backup

# Restore
docker exec ai-coder-mongodb mongorestore /data/backup
```

## Troubleshooting

### Port Already in Use

If ports 3000 or 5000 are in use:

```bash
# Check what's using the port
lsof -i :3000
lsof -i :5000

# Kill the process
kill -9 <PID>
```

### Container Won't Start

```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Remove and rebuild
docker-compose down
docker-compose up -d --build
```

### SSL Certificate Issues

```bash
# Renew certificate
certbot renew

# If renewal fails, get new certificate
certbot --nginx -d ai-coder.gleuhr.com --force-renewal
```

### Database Connection Issues

```bash
# Check MongoDB is running
docker exec -it ai-coder-mongodb mongo

# Restart MongoDB
docker-compose restart mongodb
```

## Firewall Configuration

Make sure these ports are open:

```bash
# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Allow SSH (if using UFW)
ufw allow 22/tcp

# Enable firewall
ufw enable
```

## Performance Optimization

### Enable Gzip Compression in Nginx

Add to nginx configuration:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
```

### Set up Log Rotation

```bash
# Create logrotate config
cat > /etc/logrotate.d/ai-coder << EOF
/var/log/nginx/ai-coder-*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 \`cat /var/run/nginx.pid\`
    endscript
}
EOF
```

## Security Recommendations

1. **Change JWT Secret**: Update the JWT_SECRET in backend/.env to a strong random string
2. **Enable Firewall**: Use ufw or iptables to restrict access
3. **Regular Updates**: Keep Docker, Node.js, and system packages updated
4. **Monitor Logs**: Regularly check application and nginx logs for suspicious activity
5. **Database Security**: Consider enabling MongoDB authentication in production
6. **API Rate Limiting**: Already configured in the backend (100 requests per 15 minutes)

## Monitoring

### Set up Basic Monitoring

```bash
# Install htop for system monitoring
apt install htop -y

# Monitor Docker resource usage
docker stats
```

### Health Check Endpoint

The API provides a health check endpoint:
```
GET https://ai-coder.gleuhr.com/api/health
```

## Support

For issues or questions:
1. Check application logs: `docker-compose logs -f`
2. Check nginx logs: `tail -f /var/log/nginx/ai-coder-error.log`
3. Verify all containers are running: `docker-compose ps`

## Quick Commands Reference

```bash
# Start application
cd /var/www/ai-coding-assistant && docker-compose up -d

# Stop application
docker-compose stop

# Restart application
docker-compose restart

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose down && docker-compose up -d --build

# Check nginx status
systemctl status nginx

# Reload nginx
systemctl reload nginx

# SSL renewal (automatic, but can be forced)
certbot renew
```
