# Quick Start Guide

Get Hot Fixture Tool running in your environment in just 15 minutes. This guide will walk you through setting up both the server and client components for a basic integration testing workflow.

## Prerequisites

- **Linux or macOS** system for the server
- **Go 1.21+** installed on both server and client systems
- **Database access** (MySQL or PostgreSQL)
- **Redis** instance (for caching and session management)

## Step 1: Install the Server (hfitd)

### Download and Build

```bash
# Clone the repository
git clone https://github.com/danielecr/hot-fixture-tool.git
cd hot-fixture-tool/hfitd

# Build the server daemon
make build

# You should now have the hfitd binary
ls -la hfitd
```

### Configure Environment

Create your configuration file based on your environment:

```bash
# Copy the example configuration
cp .env.example .env

# Edit the configuration
nano .env
```

### Essential Configuration

Update these key settings in your `.env` file:

```bash
# Server Configuration
SERVER_ADDRESS=:8080

# Database Providers (add your databases)
DBMS_PROVIDERS=MYSQL_DEV,POSTGRES_PROD

# MySQL Example
MYSQL_DEV.DB_TYPE=mysql
MYSQL_DEV.DB_HOST=localhost
MYSQL_DEV.DB_PORT=3306
MYSQL_DEV.DB_USER=testuser
MYSQL_DEV.DB_PASSWORD=testpass
MYSQL_DEV.DB_NAME=development_db

# PostgreSQL Example  
POSTGRES_PROD.DB_TYPE=postgres
POSTGRES_PROD.DB_HOST=prod-replica.example.com
POSTGRES_PROD.DB_PORT=5432
POSTGRES_PROD.DB_USER=readonly_user
POSTGRES_PROD.DB_PASSWORD=secure_password
POSTGRES_PROD.DB_NAME=production_db

# File Volumes (add your file locations)
VOLUMES=logs,uploads
LOGS.PATH=/var/log/application
UPLOADS.PATH=/app/uploads

# Redis Configuration
REDIS_URL=redis://localhost:6379

# JWT Secret (generate a strong random key)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
```

!!! tip "Security Note"
    Use a dedicated read-only database user with minimal permissions for production database access.

### Start the Server

```bash
# Start the server daemon
./hfitd

# Server should start and display:
# [INFO] Starting Hot Fixture Tool Server on :8080
# [INFO] Connected to Redis at localhost:6379
# [INFO] Configured DBMS providers: MYSQL_DEV, POSTGRES_PROD
# [INFO] Configured volumes: logs, uploads
```

## Step 2: Install the Client (hfit)

### Build the Client

```bash
# In a new terminal, navigate to the client directory
cd ../hfit

# Build the client CLI
go build -o hfit

# Verify installation
./hfit --help
```

### Generate SSH Keys (for Authentication)

Hot Fixture Tool uses SSH key authentication for secure access:

```bash
# Generate an ECDSA key pair (recommended)
ssh-keygen -t ecdsa -b 256 -f ~/.ssh/hfit_key

# Or generate an Ed25519 key (also good)
ssh-keygen -t ed25519 -f ~/.ssh/hfit_key

# Or use RSA if required
ssh-keygen -t rsa -b 4096 -f ~/.ssh/hfit_key
```

### Register Your Public Key

Add your public key to the server's user database:

```bash
# From the server directory
cd ../hfitd

# Register your user with the public key
./hfitd-cli adduser your-email@company.com $(cat ~/.ssh/hfit_key.pub)
```

### Configure the Client

```bash
# Configure the client to connect to your server
./hfit config set server-url http://localhost:8080
./hfit config set private-key-path ~/.ssh/hfit_key
```

## Step 3: Authenticate and Test

### Login to the Server

```bash
# Authenticate with the server
./hfit login

# You should see:
# Authentication successful!
# Token saved to ~/.hfit/token
```

### Test Basic Operations

```bash
# List available database providers
./hfit dbmss

# Should display:
# [
#   "MYSQL_DEV",
#   "POSTGRES_PROD"
# ]

# List databases in a provider
./hfit dbs MYSQL_DEV

# List available volumes
./hfit files logs

# Test downloading a file
./hfit download logs:/application.log
```

## Step 4: Create Your First Template

Templates define reusable data packages for your integration tests.

### Create a Template File

```yaml
# customer-scenario.yaml
templateName: customer-scenario
hfitVersion: "1.0"
description: "Basic customer data for integration testing"

exports:
  customers:
    type: database
    provider: MYSQL_DEV
    query: |
      SELECT customer_id, email, created_at 
      FROM customers 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      LIMIT 100
    
  orders:
    type: database  
    provider: MYSQL_DEV
    query: |
      SELECT o.order_id, o.customer_id, o.total_amount, o.created_at
      FROM orders o
      JOIN customers c ON o.customer_id = c.customer_id
      WHERE c.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      
  config_files:
    type: files
    volume: logs
    filters:
      - "name:config_*.json"
      - "mtime:7"
```

### Upload the Template

```bash
# Create the template on the server
./hfit pkg-tmpl create customer-scenario.yaml

# Verify it was created
./hfit pkg-tmpl list

# Should show:
# Package Templates:
#   customer-scenario
```

## Step 5: Generate and Use Data Packages

### Download Your First Data Package

```bash
# Generate and download the data package
./hfit pkg-download customer-scenario

# The command will:
# 1. Execute the database queries
# 2. Collect the specified files  
# 3. Package everything together
# 4. Stream the results to your terminal
```

### Use in Integration Tests

The downloaded data can be used directly in your integration tests:

```bash
# Example integration test workflow
./hfit pkg-download customer-scenario > test-data.sql

# Import into your test database
mysql test_database < test-data.sql

# Run your integration tests
./run-integration-tests.sh

# Clean up
mysql test_database -e "DROP DATABASE test_database; CREATE DATABASE test_database;"
```

## Next Steps

🎉 **Congratulations!** You now have Hot Fixture Tool running and can generate data packages for integration testing.

### Learn More

- **[Server Configuration](../server/configuration.md)** - Detailed server setup options
- **[Client Commands](../client/commands.md)** - Complete CLI reference  
- **[Template Creation Guide](../guides/template-creation.md)** - Advanced template features
- **[Integration Testing Workflows](../guides/integration-testing.md)** - Best practices and patterns

### Production Deployment

- **[Docker Deployment](../server/deployment.md)** - Containerized production setup
- **[Security Best Practices](../guides/security.md)** - Hardening and compliance
- **[Scaling and Performance](../server/administration.md)** - Multi-instance deployments

### Common Issues

If you encounter problems, check:

- **[Server Troubleshooting](../server/troubleshooting.md)**
- **[Client Troubleshooting](../client/troubleshooting.md)**  
- **[GitHub Issues](https://github.com/danielecr/hot-fixture-tool/issues)**

## Support

Need help? Here are your options:

- 📖 **Documentation**: Browse the complete documentation
- 🐛 **Issues**: [Report bugs on GitHub](https://github.com/danielecr/hot-fixture-tool/issues)
- 💬 **Discussions**: [Community discussions](https://github.com/danielecr/hot-fixture-tool/discussions)
- ❤️ **Sponsor**: [Support development](https://github.com/sponsors/danielecr)