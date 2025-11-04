# Configuration

This comprehensive guide covers all configuration options for the Hot Fixture Tool server daemon (`hfitd`). The server uses environment variables for configuration, typically loaded from a `.env` file.

## Configuration File Location

The server looks for configuration in the following order:

1. Environment variables
2. `.env` file in the current working directory
3. `/etc/hfitd/.env` (system-wide configuration)

## Complete Configuration Reference

### Server Configuration

#### Basic Server Settings

```bash
# Server bind address and port
SERVER_ADDRESS=:8080

# Enable debug mode (development only)
DEBUG=false

# Request timeout (seconds)
REQUEST_TIMEOUT=30

# Maximum request body size (bytes)
MAX_REQUEST_SIZE=104857600  # 100MB
```

#### HTTPS/TLS Configuration

```bash
# TLS Certificate file path (for HTTPS)
TLS_CERT_FILE=/etc/ssl/certs/hfitd.crt

# TLS Private key file path
TLS_KEY_FILE=/etc/ssl/private/hfitd.key

# Minimum TLS version (1.2 or 1.3)
TLS_MIN_VERSION=1.2
```

### Authentication Configuration

#### JWT Settings

```bash
# JWT signing secret (REQUIRED - use a strong random key)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# JWT token expiration time (hours)
JWT_EXPIRATION=24

# JWT issuer
JWT_ISSUER=hot-fixture-tool

# JWT audience
JWT_AUDIENCE=hfit-clients
```

#### Authentication Methods

```bash
# Supported SSH key types (comma-separated)
SUPPORTED_KEY_TYPES=rsa,ecdsa,ed25519

# Maximum authentication attempts before lockout
MAX_AUTH_ATTEMPTS=5

# Authentication lockout duration (minutes)
AUTH_LOCKOUT_DURATION=15
```

### Database Configuration

#### DBMS Providers

Define multiple database providers for different environments:

```bash
# List of configured DBMS providers (comma-separated)
DBMS_PROVIDERS=PROD_MYSQL,STAGING_MYSQL,DEV_POSTGRES,PROD_POSTGRES

# MySQL Production Database
PROD_MYSQL.DB_TYPE=mysql
PROD_MYSQL.DB_HOST=mysql-prod.company.com
PROD_MYSQL.DB_PORT=3306
PROD_MYSQL.DB_USER=hfit_readonly
PROD_MYSQL.DB_PASSWORD=secure_production_password
PROD_MYSQL.DB_NAME=production_database
PROD_MYSQL.DB_TIMEOUT=30
PROD_MYSQL.DB_MAX_CONNECTIONS=10
PROD_MYSQL.DB_MAX_IDLE=5

# MySQL Staging Database
STAGING_MYSQL.DB_TYPE=mysql
STAGING_MYSQL.DB_HOST=mysql-staging.company.com
STAGING_MYSQL.DB_PORT=3306
STAGING_MYSQL.DB_USER=hfit_readonly
STAGING_MYSQL.DB_PASSWORD=secure_staging_password
STAGING_MYSQL.DB_NAME=staging_database
STAGING_MYSQL.DB_TIMEOUT=30
STAGING_MYSQL.DB_MAX_CONNECTIONS=5
STAGING_MYSQL.DB_MAX_IDLE=2

# PostgreSQL Development Database
DEV_POSTGRES.DB_TYPE=postgres
DEV_POSTGRES.DB_HOST=localhost
DEV_POSTGRES.DB_PORT=5432
DEV_POSTGRES.DB_USER=hfit_readonly
DEV_POSTGRES.DB_PASSWORD=dev_password
DEV_POSTGRES.DB_NAME=development_database
DEV_POSTGRES.DB_TIMEOUT=30
DEV_POSTGRES.DB_SSL_MODE=disable

# PostgreSQL Production Database
PROD_POSTGRES.DB_TYPE=postgres
PROD_POSTGRES.DB_HOST=postgres-prod.company.com
PROD_POSTGRES.DB_PORT=5432
PROD_POSTGRES.DB_USER=hfit_readonly
PROD_POSTGRES.DB_PASSWORD=secure_postgres_password
PROD_POSTGRES.DB_NAME=production_database
PROD_POSTGRES.DB_TIMEOUT=30
PROD_POSTGRES.DB_SSL_MODE=require
PROD_POSTGRES.DB_MAX_CONNECTIONS=10
PROD_POSTGRES.DB_MAX_IDLE=5
```

#### Database Connection Options

| Parameter | Description | Default | Supported DBs |
|-----------|-------------|---------|---------------|
| `DB_TYPE` | Database type (`mysql`, `postgres`) | Required | All |
| `DB_HOST` | Database hostname or IP | Required | All |
| `DB_PORT` | Database port | `3306` (MySQL), `5432` (PostgreSQL) | All |
| `DB_USER` | Database username | Required | All |
| `DB_PASSWORD` | Database password | Required | All |
| `DB_NAME` | Database name | Required | All |
| `DB_TIMEOUT` | Connection timeout (seconds) | `30` | All |
| `DB_MAX_CONNECTIONS` | Maximum concurrent connections | `10` | All |
| `DB_MAX_IDLE` | Maximum idle connections | `5` | All |
| `DB_SSL_MODE` | SSL mode (`disable`, `require`, `verify-full`) | `require` | PostgreSQL |

### Volume Configuration

#### File System Volumes

Configure access to file system locations:

```bash
# List of configured volumes (comma-separated)
VOLUMES=application_logs,user_uploads,config_files,backup_files

# Application Logs Volume
APPLICATION_LOGS.PATH=/var/log/applications
APPLICATION_LOGS.READ_ONLY=true
APPLICATION_LOGS.MAX_FILE_SIZE=104857600  # 100MB
APPLICATION_LOGS.ALLOWED_EXTENSIONS=.log,.txt,.json

# User Uploads Volume
USER_UPLOADS.PATH=/storage/uploads
USER_UPLOADS.READ_ONLY=true
USER_UPLOADS.MAX_FILE_SIZE=1073741824  # 1GB
USER_UPLOADS.ALLOWED_EXTENSIONS=.jpg,.png,.pdf,.doc,.docx

# Configuration Files Volume
CONFIG_FILES.PATH=/etc/applications
CONFIG_FILES.READ_ONLY=true
CONFIG_FILES.MAX_FILE_SIZE=10485760  # 10MB
CONFIG_FILES.ALLOWED_EXTENSIONS=.yaml,.yml,.json,.toml,.ini

# Backup Files Volume (larger files allowed)
BACKUP_FILES.PATH=/backup/application-data
BACKUP_FILES.READ_ONLY=true
BACKUP_FILES.MAX_FILE_SIZE=10737418240  # 10GB
BACKUP_FILES.ALLOWED_EXTENSIONS=.sql,.tar,.gz,.zip
```

#### Volume Security Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| `PATH` | File system path | Required |
| `READ_ONLY` | Enforce read-only access | `true` |
| `MAX_FILE_SIZE` | Maximum file size (bytes) | `104857600` (100MB) |
| `ALLOWED_EXTENSIONS` | Allowed file extensions | All files |
| `HIDDEN_FILES` | Show hidden files (starting with `.`) | `false` |
| `FOLLOW_SYMLINKS` | Follow symbolic links | `false` |

### Redis Configuration

#### Basic Redis Settings

```bash
# Redis connection URL
REDIS_URL=redis://localhost:6379

# Redis password (if required)
REDIS_PASSWORD=your_redis_password

# Redis database number
REDIS_DB=0

# Redis connection timeout (seconds)
REDIS_TIMEOUT=5

# Redis pool size
REDIS_POOL_SIZE=10
```

#### Redis with Cluster/Sentinel

```bash
# Redis Cluster (comma-separated nodes)
REDIS_CLUSTER_NODES=redis1.company.com:6379,redis2.company.com:6379,redis3.company.com:6379

# Redis Sentinel
REDIS_SENTINEL_MASTER=mymaster
REDIS_SENTINEL_NODES=sentinel1.company.com:26379,sentinel2.company.com:26379
```

### Admin Configuration

#### Administrative Access

```bash
# Unix socket path for admin CLI
HFITD_SOCKET_PATH=/var/run/hfitd.sock

# Admin socket permissions
HFITD_SOCKET_MODE=0660

# Admin socket group
HFITD_SOCKET_GROUP=hfitd

# Enable admin API endpoints
ENABLE_ADMIN_API=false

# Admin API key (if admin API is enabled)
ADMIN_API_KEY=admin-api-secret-key
```

### Logging Configuration

#### Log Settings

```bash
# Log level (debug, info, warn, error)
LOG_LEVEL=info

# Log format (json, text)
LOG_FORMAT=json

# Log output (stdout, file, syslog)
LOG_OUTPUT=stdout

# Log file path (if LOG_OUTPUT=file)
LOG_FILE=/var/log/hfitd/hfitd.log

# Log rotation settings
LOG_MAX_SIZE=100    # MB
LOG_MAX_BACKUPS=5
LOG_MAX_AGE=30      # days
```

### Performance Configuration

#### Caching Settings

```bash
# Template cache TTL (seconds)
TEMPLATE_CACHE_TTL=3600

# Database metadata cache TTL (seconds)
DB_METADATA_CACHE_TTL=1800

# File listing cache TTL (seconds)
FILE_CACHE_TTL=300

# Maximum cache memory usage (MB)
MAX_CACHE_SIZE=512
```

#### Rate Limiting

```bash
# Enable rate limiting
ENABLE_RATE_LIMITING=true

# Requests per minute per IP
RATE_LIMIT_REQUESTS=60

# Rate limit window (minutes)
RATE_LIMIT_WINDOW=1

# Rate limit burst size
RATE_LIMIT_BURST=10
```

#### Connection Limits

```bash
# Maximum concurrent connections
MAX_CONNECTIONS=1000

# Connection idle timeout (seconds)
CONNECTION_IDLE_TIMEOUT=300

# Read timeout (seconds)
READ_TIMEOUT=30

# Write timeout (seconds)
WRITE_TIMEOUT=30
```

## Configuration Examples

### Development Environment

```bash
# .env for development
SERVER_ADDRESS=:8080
DEBUG=true
LOG_LEVEL=debug

# Single database for development
DBMS_PROVIDERS=LOCAL_MYSQL
LOCAL_MYSQL.DB_TYPE=mysql
LOCAL_MYSQL.DB_HOST=localhost
LOCAL_MYSQL.DB_PORT=3306
LOCAL_MYSQL.DB_USER=developer
LOCAL_MYSQL.DB_PASSWORD=devpass
LOCAL_MYSQL.DB_NAME=app_development

# Local volumes
VOLUMES=dev_logs
DEV_LOGS.PATH=/tmp/dev-logs

# Local Redis
REDIS_URL=redis://localhost:6379

# Simple JWT secret
JWT_SECRET=development-secret-not-for-production
```

### Production Environment

```bash
# .env for production
SERVER_ADDRESS=:8443
DEBUG=false
LOG_LEVEL=info
LOG_FORMAT=json
LOG_OUTPUT=file
LOG_FILE=/var/log/hfitd/hfitd.log

# HTTPS configuration
TLS_CERT_FILE=/etc/ssl/certs/hfitd.crt
TLS_KEY_FILE=/etc/ssl/private/hfitd.key
TLS_MIN_VERSION=1.2

# Multiple production databases
DBMS_PROVIDERS=PROD_MYSQL,PROD_POSTGRES,REPLICA_MYSQL
PROD_MYSQL.DB_TYPE=mysql
PROD_MYSQL.DB_HOST=mysql-prod-master.company.com
PROD_MYSQL.DB_PORT=3306
PROD_MYSQL.DB_USER=hfit_readonly
PROD_MYSQL.DB_PASSWORD=complex_production_password
PROD_MYSQL.DB_NAME=production_app
PROD_MYSQL.DB_MAX_CONNECTIONS=20
PROD_MYSQL.DB_TIMEOUT=60

# Production volumes with security
VOLUMES=app_logs,user_data,configs
APP_LOGS.PATH=/var/log/production-app
APP_LOGS.READ_ONLY=true
APP_LOGS.MAX_FILE_SIZE=524288000  # 500MB
APP_LOGS.ALLOWED_EXTENSIONS=.log,.json

# Redis cluster
REDIS_CLUSTER_NODES=redis1.company.com:6379,redis2.company.com:6379,redis3.company.com:6379
REDIS_PASSWORD=redis_cluster_password

# Strong JWT secret
JWT_SECRET=production-jwt-secret-key-64-characters-long-random-string

# Rate limiting enabled
ENABLE_RATE_LIMITING=true
RATE_LIMIT_REQUESTS=100
MAX_CONNECTIONS=2000

# Admin access
HFITD_SOCKET_PATH=/var/run/hfitd.sock
HFITD_SOCKET_MODE=0660
HFITD_SOCKET_GROUP=hfitd
```

## Configuration Validation

### Check Configuration

```bash
# Validate configuration file
hfitd --config-check

# Test database connections
hfitd --test-db

# Test Redis connection
hfitd --test-redis

# Test volume access
hfitd --test-volumes
```

### Environment Variables Override

Environment variables take precedence over `.env` file settings:

```bash
# Override specific settings via environment
export SERVER_ADDRESS=:9090
export DEBUG=true
hfitd

# Override database password for security
export PROD_MYSQL.DB_PASSWORD="$(cat /etc/secrets/mysql-password)"
hfitd
```

## Security Best Practices

### Database Security

- **Use read-only database users** with minimal permissions
- **Rotate database passwords** regularly
- **Use SSL/TLS** for database connections when possible
- **Network isolation** - restrict database access to hfitd server only

### JWT Security

- **Generate strong JWT secrets** (64+ random characters)
- **Rotate JWT secrets** periodically  
- **Set appropriate expiration times** (not too long)
- **Monitor for token abuse**

### Volume Security

- **Set read-only access** whenever possible
- **Restrict file extensions** to prevent execution
- **Set maximum file sizes** to prevent abuse
- **Use dedicated service accounts** with minimal file system permissions

### Network Security

- **Use HTTPS in production** with valid certificates
- **Enable rate limiting** to prevent abuse
- **Use firewalls** to restrict access to necessary ports only
- **Monitor access logs** for suspicious activity

## Troubleshooting Configuration

### Common Issues

**Invalid configuration syntax:**
```bash
# Check for syntax errors
hfitd --config-check
```

**Database connection failures:**
```bash
# Test specific database provider
hfitd --test-db PROD_MYSQL
```

**Redis connection issues:**
```bash
# Verify Redis connectivity
redis-cli -h redis.company.com ping
```

**Volume access problems:**
```bash
# Check file permissions
ls -la /var/log/applications
sudo -u hfitd ls /var/log/applications
```

### Configuration Reload

The server requires a restart to pick up configuration changes:

```bash
# Graceful restart
sudo systemctl reload hfitd

# Or full restart
sudo systemctl restart hfitd
```

## Next Steps

- **[Deployment Guide](deployment.md)** - Production deployment strategies
- **[Administration](administration.md)** - User management and maintenance
- **[Security Guide](../guides/security.md)** - Advanced security configuration
- **[Troubleshooting](troubleshooting.md)** - Common issues and solutions