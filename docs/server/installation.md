# Installation

This guide covers the installation of the Hot Fixture Tool server daemon (`hfitd`) on your target system.

## System Requirements

### Hardware Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| **CPU** | 2 cores | 4+ cores |
| **RAM** | 4 GB | 8+ GB |
| **Storage** | 10 GB free | 50+ GB free |
| **Network** | 100 Mbps | 1 Gbps |

### Operating System Support

- **Linux** (Ubuntu 20.04+, CentOS 8+, RHEL 8+, Debian 10+)
- **macOS** (10.15+) - Development only
- **Docker** - Recommended for production

### Dependencies

- **Go 1.21+** (for building from source)
- **Redis 6.0+** (session and cache management)
- **Database access** to your data sources
- **SSL/TLS certificates** (for production HTTPS)

## Installation Methods

### Method 1: Binary Release (Recommended)

Download pre-built binaries from the GitHub releases page:

```bash
# Download the latest release for Linux x64
curl -L https://github.com/danielecr/hot-fixture-tool/releases/latest/download/hfitd-linux-amd64.tar.gz -o hfitd.tar.gz

# Extract the archive
tar -xzf hfitd.tar.gz

# Move to system location
sudo mv hfitd /usr/local/bin/
sudo mv hfitd-cli /usr/local/bin/

# Make executable
sudo chmod +x /usr/local/bin/hfitd
sudo chmod +x /usr/local/bin/hfitd-cli

# Verify installation
hfitd --version
```

### Method 2: Build from Source

Build the latest version from the source code:

```bash
# Clone the repository
git clone https://github.com/danielecr/hot-fixture-tool.git
cd hot-fixture-tool/hfitd

# Install Go dependencies
go mod download

# Build the server daemon
make build

# Build the admin CLI
make build-cli

# Install system-wide (optional)
sudo cp hfitd /usr/local/bin/
sudo cp hfitd-cli /usr/local/bin/
```

### Method 3: Docker Installation

Use the official Docker image for containerized deployment:

```bash
# Pull the latest image
docker pull danielecr/hfitd:latest

# Or build locally
git clone https://github.com/danielecr/hot-fixture-tool.git
cd hot-fixture-tool/hfitd
docker build -t hfitd .
```

## Configuration Setup

### Create Configuration Directory

```bash
# Create configuration directory
sudo mkdir -p /etc/hfitd
sudo mkdir -p /var/log/hfitd
sudo mkdir -p /var/lib/hfitd

# Set appropriate permissions
sudo chown -R hfitd:hfitd /etc/hfitd /var/log/hfitd /var/lib/hfitd
```

### Environment Configuration

Create your configuration file:

```bash
# Copy example configuration
sudo cp .env.example /etc/hfitd/.env

# Edit configuration
sudo nano /etc/hfitd/.env
```

### Essential Configuration

Configure these mandatory settings:

```bash
# /etc/hfitd/.env

# Server Configuration
SERVER_ADDRESS=:8080

# Security Configuration  
JWT_SECRET=generate-a-strong-random-secret-key-here

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Database Providers (configure your databases)
DBMS_PROVIDERS=PROD_MYSQL,STAGING_POSTGRES

# MySQL Configuration
PROD_MYSQL.DB_TYPE=mysql
PROD_MYSQL.DB_HOST=mysql.production.company.com
PROD_MYSQL.DB_PORT=3306
PROD_MYSQL.DB_USER=readonly_hfit
PROD_MYSQL.DB_PASSWORD=secure_readonly_password
PROD_MYSQL.DB_NAME=production_database

# PostgreSQL Configuration
STAGING_POSTGRES.DB_TYPE=postgres
STAGING_POSTGRES.DB_HOST=postgres.staging.company.com
STAGING_POSTGRES.DB_PORT=5432
STAGING_POSTGRES.DB_USER=readonly_hfit
STAGING_POSTGRES.DB_PASSWORD=secure_readonly_password
STAGING_POSTGRES.DB_NAME=staging_database

# Volume Configuration (file access)
VOLUMES=application_logs,user_uploads
APPLICATION_LOGS.PATH=/var/log/applications
USER_UPLOADS.PATH=/storage/uploads

# Admin Socket (for hfitd-cli)
HFITD_SOCKET_PATH=/var/run/hfitd.sock
```

!!! warning "Security Best Practice"
    Always use dedicated read-only database users with minimal permissions for production database access.

## Service Installation

### Systemd Service (Linux)

Create a systemd service for automatic startup:

```bash
# Create service file
sudo nano /etc/systemd/system/hfitd.service
```

```ini
[Unit]
Description=Hot Fixture Tool Daemon
Documentation=https://github.com/danielecr/hot-fixture-tool
After=network.target redis.service
Wants=redis.service

[Service]
Type=simple
User=hfitd
Group=hfitd
ExecStart=/usr/local/bin/hfitd
WorkingDirectory=/etc/hfitd
EnvironmentFile=/etc/hfitd/.env
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=hfitd

# Security settings
NoNewPrivileges=true
PrivateTmp=true
PrivateDevices=true
ProtectHome=true
ProtectSystem=strict
ReadWritePaths=/var/log/hfitd /var/lib/hfitd /var/run

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable auto-start
sudo systemctl enable hfitd

# Start the service
sudo systemctl start hfitd

# Check status
sudo systemctl status hfitd
```

### User Management

Create a dedicated system user for the service:

```bash
# Create hfitd user
sudo useradd --system --home-dir /var/lib/hfitd --shell /bin/false hfitd

# Set ownership
sudo chown -R hfitd:hfitd /etc/hfitd /var/log/hfitd /var/lib/hfitd
```

## Database Setup

### MySQL Setup

Create a dedicated read-only user for Hot Fixture Tool:

```sql
-- Connect to MySQL as admin
mysql -u root -p

-- Create dedicated database user
CREATE USER 'hfit_readonly'@'%' IDENTIFIED BY 'secure_random_password';

-- Grant read-only permissions
GRANT SELECT ON production_database.* TO 'hfit_readonly'@'%';

-- Apply changes
FLUSH PRIVILEGES;

-- Test connection
SHOW GRANTS FOR 'hfit_readonly'@'%';
```

### PostgreSQL Setup

Create a dedicated read-only user for Hot Fixture Tool:

```sql
-- Connect to PostgreSQL as admin
psql -U postgres

-- Create dedicated database user
CREATE USER hfit_readonly WITH PASSWORD 'secure_random_password';

-- Grant read-only permissions
GRANT CONNECT ON DATABASE production_database TO hfit_readonly;
GRANT USAGE ON SCHEMA public TO hfit_readonly;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO hfit_readonly;

-- Set default permissions for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO hfit_readonly;

-- Test connection
\du hfit_readonly
```

## Redis Setup

### Install Redis (if not already available)

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

**CentOS/RHEL:**
```bash
sudo yum install redis

# Start Redis  
sudo systemctl start redis
sudo systemctl enable redis
```

### Redis Configuration

Basic security configuration for Redis:

```bash
# /etc/redis/redis.conf

# Bind to localhost only (adjust for your network)
bind 127.0.0.1

# Set a password (optional but recommended)
requirepass your_redis_password

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command SHUTDOWN SHUTDOWN_HFITD
```

Update your hfitd configuration if using Redis password:

```bash
# /etc/hfitd/.env
REDIS_URL=redis://:your_redis_password@localhost:6379
```

## SSL/TLS Configuration (Production)

For production deployments, configure HTTPS:

### Generate SSL Certificate

**Using Let's Encrypt (recommended):**
```bash
# Install certbot
sudo apt install certbot

# Generate certificate
sudo certbot certonly --standalone -d hfitd.your-company.com

# Certificate will be saved to:
# /etc/letsencrypt/live/hfitd.your-company.com/
```

**Using self-signed certificate (development):**
```bash
# Generate self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout /etc/hfitd/server.key -out /etc/hfitd/server.crt -days 365 -nodes
```

### Configure HTTPS

Update your environment configuration:

```bash
# /etc/hfitd/.env

# Enable HTTPS
SERVER_ADDRESS=:8443
TLS_CERT_FILE=/etc/letsencrypt/live/hfitd.your-company.com/fullchain.pem
TLS_KEY_FILE=/etc/letsencrypt/live/hfitd.your-company.com/privkey.pem
```

## Verification

### Check Installation

```bash
# Verify hfitd is running
sudo systemctl status hfitd

# Check logs
sudo journalctl -u hfitd -f

# Test API endpoint
curl http://localhost:8080/health

# Should return: {"status":"ok","timestamp":"..."}
```

### User Registration

Register your first user account:

```bash
# Generate SSH key for authentication
ssh-keygen -t ecdsa -b 256 -f ~/.ssh/hfitd_key

# Register user with the server
sudo hfitd-cli adduser admin@your-company.com $(cat ~/.ssh/hfitd_key.pub)
```

## Troubleshooting

### Common Issues

**Service won't start:**
```bash
# Check configuration syntax
sudo hfitd --config-check

# Check logs for errors
sudo journalctl -u hfitd --no-pager
```

**Database connection issues:**
```bash
# Test database connectivity manually
mysql -h mysql.production.company.com -u hfit_readonly -p production_database

# Check firewall rules
sudo ufw status
```

**Redis connection issues:**
```bash
# Test Redis connectivity
redis-cli ping

# Check Redis logs
sudo journalctl -u redis --no-pager
```

### Log Locations

- **System logs**: `sudo journalctl -u hfitd`
- **Application logs**: `/var/log/hfitd/hfitd.log`
- **Error logs**: `/var/log/hfitd/error.log`

## Next Steps

After successful installation:

1. **[Configuration](configuration.md)** - Detailed configuration options
2. **[Administration](administration.md)** - User management and maintenance
3. **[Client Installation](../client/installation.md)** - Install the CLI client
4. **[Security Setup](../guides/security.md)** - Hardening and best practices

## Support

- 📖 **Documentation**: [Complete server documentation](./troubleshooting.md)
- 🐛 **Issues**: [Report installation problems](https://github.com/danielecr/hot-fixture-tool/issues)
- 💬 **Community**: [Get help from the community](https://github.com/danielecr/hot-fixture-tool/discussions)