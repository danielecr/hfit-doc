# Commands Reference

Complete reference for all Hot Fixture Tool CLI (`hfit`) commands. The client provides intuitive commands for database access, file operations, and template management.

## Global Options

These options are available for all commands:

```bash
# Show help for any command
hfit <command> --help

# Verbose output (show detailed progress)
hfit --verbose <command>

# Specify custom config directory
hfit --config-dir ~/.custom-hfit <command>

# Override server URL
hfit --server-url https://hfitd.company.com <command>
```

## Authentication Commands

### `login`

Authenticate with the hfitd server using SSH key authentication.

```bash
# Basic login (uses configured private key)
hfit login

# Login with specific private key
hfit login --private-key ~/.ssh/custom_key

# Login with passphrase-protected key
hfit login --private-key ~/.ssh/encrypted_key
```

**Examples:**
```bash
# Standard authentication
hfit login
# Output: Authentication successful! Token saved to ~/.hfit/token

# Using ECDSA key with passphrase
hfit login --private-key ~/.ssh/hfit_ecdsa
# Prompts: Enter passphrase for key ~/.ssh/hfit_ecdsa:
# Output: Authentication successful!
```

### `config`

Manage client configuration settings.

```bash
# Show current configuration
hfit config show

# Set configuration values
hfit config set <key> <value>

# Get specific configuration value
hfit config get <key>

# List all configuration keys
hfit config list
```

**Configuration Keys:**
- `server-url`: hfitd server URL
- `private-key-path`: Path to SSH private key
- `timeout`: Request timeout in seconds
- `verify-ssl`: Enable/disable SSL certificate verification

**Examples:**
```bash
# Configure server URL
hfit config set server-url https://hfitd.company.com:8443

# Set private key path
hfit config set private-key-path ~/.ssh/hfit_production_key

# Show all configuration
hfit config show
# Output:
# server-url: https://hfitd.company.com:8443
# private-key-path: ~/.ssh/hfit_production_key
# timeout: 30
# verify-ssl: true
```

## Database Commands

### `dbmss`

List all configured database management system providers.

```bash
# List all DBMS providers
hfit dbmss
```

**Example:**
```bash
hfit dbmss
# Output:
# [
#   "PROD_MYSQL",
#   "STAGING_POSTGRES", 
#   "DEV_MYSQL"
# ]
```

### `dbs`

List databases available in a specific DBMS provider.

```bash
# List databases in a DBMS provider
hfit dbs <dbms_provider>
```

**Examples:**
```bash
# List MySQL production databases
hfit dbs PROD_MYSQL
# Output:
# [
#   "production_app",
#   "production_analytics",
#   "production_logs"
# ]

# List PostgreSQL staging databases
hfit dbs STAGING_POSTGRES
# Output:
# [
#   "staging_app",
#   "staging_test"
# ]
```

### `tables`

List tables in a specific database.

```bash
# List tables in a database
hfit tables <dbms_provider> <database_id>
```

**Examples:**
```bash
# List tables in production app database
hfit tables PROD_MYSQL production_app
# Output:
# [
#   "users",
#   "orders", 
#   "products",
#   "payments"
# ]
```

### `rows`

Stream table data with optional filtering.

```bash
# Stream all rows from a table
hfit rows <dbms_provider> <database_id> <table_id>

# Stream rows with SQL filter
hfit rows <dbms_provider> <database_id> <table_id> <filter_expression>
```

**Examples:**
```bash
# Stream all users
hfit rows PROD_MYSQL production_app users

# Stream recent orders
hfit rows PROD_MYSQL production_app orders "created_at >= '2024-01-01'"

# Stream users with specific criteria
hfit rows PROD_MYSQL production_app users "status='active' AND created_at >= NOW() - INTERVAL 30 DAY"
```

## File Commands

### `files`

Browse and list files in configured volumes.

```bash
# List all files in a volume
hfit files <volume>

# List files with filters
hfit files <volume> [filters...]
```

**Available Filters:**
- `name:pattern` - File name pattern with wildcards (* and ?)
- `mtime:days` - Modified time filter (positive = last N days, negative = older than N days)
- `size:condition` - File size filter (>, <, =)

**Examples:**
```bash
# List all files in logs volume
hfit files application_logs

# Find log files from last 7 days
hfit files application_logs "name:*.log" "mtime:7"

# Find large backup files
hfit files backups "name:backup_*" "size:>1048576"

# Find configuration files
hfit files configs "name:*.json" "name:*.yaml"

# Find old log files (older than 30 days)
hfit files application_logs "name:*.log" "mtime:-30"
```

### `download`

Download files from configured volumes.

```bash
# Download a file
hfit download <volume>:/<path>
```

**Examples:**
```bash
# Download a specific log file
hfit download application_logs:/2024/01/15/app.log

# Download configuration file
hfit download configs:/production/database.yaml

# Download and save to file
hfit download application_logs:/error.log > local_error.log

# Download large file with progress
hfit download backups:/monthly/backup_2024_01.sql.gz > backup.sql.gz
```

## Template Commands

Templates define reusable data packages that combine database queries and file collections for integration testing.

### `pkg-tmpl list`

List all available package templates.

```bash
# List all templates
hfit pkg-tmpl list
```

**Example:**
```bash
hfit pkg-tmpl list
# Output:
# Package Templates:
#   customer-onboarding-test
#   payment-flow-scenario
#   user-management-test
#   order-processing-flow
```

### `pkg-tmpl show`

Display the contents of a specific template.

```bash
# Show template definition
hfit pkg-tmpl show <template_name>
```

**Example:**
```bash
hfit pkg-tmpl show customer-onboarding-test
# Output: (YAML template definition)
# templateName: customer-onboarding-test
# hfitVersion: "1.0"
# description: "Customer onboarding test scenario"
# exports:
#   customers:
#     type: database
#     provider: PROD_MYSQL
#     query: |
#       SELECT * FROM customers 
#       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
#   ...
```

### `pkg-tmpl create`

Create a new template from a local YAML file.

```bash
# Create template from file
hfit pkg-tmpl create <template_file.yaml>
```

**Template File Format:**
```yaml
templateName: my-test-scenario
hfitVersion: "1.0"
description: "Description of the test scenario"

exports:
  table_export:
    type: database
    provider: PROD_MYSQL
    query: |
      SELECT customer_id, email, created_at
      FROM customers
      WHERE status = 'active'
      LIMIT 1000
      
  config_files:
    type: files
    volume: configs
    filters:
      - "name:*.json"
      - "mtime:30"
```

**Example:**
```bash
# Create new template
hfit pkg-tmpl create my-scenario.yaml
# Output: Template created successfully from file 'my-scenario.yaml'
```

### `pkg-tmpl update`

Update an existing template with new content.

```bash
# Update template from file
hfit pkg-tmpl update <template_file.yaml>
```

**Example:**
```bash
# Update existing template
hfit pkg-tmpl update improved-scenario.yaml
# Output: Template updated successfully from file 'improved-scenario.yaml'
```

### `pkg-tmpl patch`

Partially update a template and show the differences.

```bash
# Patch template and show diff
hfit pkg-tmpl patch <template_file.yaml>
```

**Example:**
```bash
# Patch template with changes
hfit pkg-tmpl patch modified-scenario.yaml
# Output: (Shows diff of changes)
# --- Original
# +++ Modified
# @@ -5,7 +5,7 @@
#  exports:
#    customers:
#      type: database
# -    provider: STAGING_MYSQL
# +    provider: PROD_MYSQL
```

### `pkg-tmpl delete`

Delete a template from the server.

```bash
# Delete template
hfit pkg-tmpl delete <template_name>
```

**Example:**
```bash
# Remove old template
hfit pkg-tmpl delete old-test-scenario
# Output: Template 'old-test-scenario' deleted successfully
```

## Package Commands

### `pkg-download`

Generate and download a data package from a template.

```bash
# Generate package from template
hfit pkg-download <template_name> [parameters...]

# Generate with custom parameters
hfit pkg-download <template_name> key1=value1 key2=value2
```

**Examples:**
```bash
# Generate basic customer scenario
hfit pkg-download customer-onboarding-test

# Generate with date parameters
hfit pkg-download monthly-report start_date=2024-01-01 end_date=2024-01-31

# Generate and save to file
hfit pkg-download integration-test-data > test-data-package.sql

# Generate with multiple parameters
hfit pkg-download user-analysis-test user_type=premium region=US limit=500
```

## Advanced Usage

### Pipeline and Automation

The CLI is designed for use in scripts and CI/CD pipelines:

```bash
#!/bin/bash
# Integration test setup script

# Authenticate
hfit login

# Download test data
hfit pkg-download ci-test-scenario > test-data.sql

# Import into test database
mysql test_database < test-data.sql

# Run tests
./run-integration-tests.sh

# Cleanup
mysql test_database -e "TRUNCATE TABLE users; TRUNCATE TABLE orders;"
```

### Error Handling

All commands return appropriate exit codes for automation:

- **0**: Success
- **1**: General error (authentication, network, etc.)
- **2**: Invalid arguments or usage
- **3**: Server error
- **4**: Resource not found

**Example with error handling:**
```bash
#!/bin/bash

if hfit login; then
    echo "Authentication successful"
else
    echo "Authentication failed" >&2
    exit 1
fi

if hfit pkg-download test-scenario > data.sql; then
    echo "Data downloaded successfully"
    mysql test_db < data.sql
else
    echo "Failed to download test data" >&2
    exit 1
fi
```

### Output Formats

Most commands output JSON for programmatic processing:

```bash
# Parse DBMS list with jq
hfit dbmss | jq -r '.[]'

# Count available databases
hfit dbs PROD_MYSQL | jq 'length'

# Get template names only
hfit pkg-tmpl list | grep "^  " | sed 's/^  //'
```

### Configuration Management

For multiple environments, use different config directories:

```bash
# Development environment
hfit --config-dir ~/.hfit-dev login
hfit --config-dir ~/.hfit-dev pkg-download dev-scenario

# Production environment
hfit --config-dir ~/.hfit-prod login
hfit --config-dir ~/.hfit-prod pkg-download prod-scenario

# Staging environment
hfit --config-dir ~/.hfit-staging login
hfit --config-dir ~/.hfit-staging pkg-download staging-scenario
```

## Common Workflows

### Daily Development Workflow

```bash
# 1. Authenticate (once per day)
hfit login

# 2. Download fresh test data
hfit pkg-download daily-dev-scenario > fresh-test-data.sql

# 3. Reset test database
mysql test_db < fresh-test-data.sql

# 4. Run integration tests
./run-tests.sh
```

### Bug Investigation Workflow

```bash
# 1. Login
hfit login

# 2. Download data from the incident timeframe
hfit pkg-download incident-investigation start_time="2024-03-15 14:30:00" end_time="2024-03-15 15:00:00"

# 3. Import and analyze
mysql debug_db < incident-data.sql
```

### Template Development Workflow

```bash
# 1. Create template file
cat > my-scenario.yaml << EOF
templateName: my-scenario
hfitVersion: "1.0"
description: "My test scenario"
exports:
  users:
    type: database
    provider: PROD_MYSQL
    query: "SELECT * FROM users LIMIT 10"
EOF

# 2. Create template
hfit pkg-tmpl create my-scenario.yaml

# 3. Test template
hfit pkg-download my-scenario

# 4. Iterate and update
vim my-scenario.yaml
hfit pkg-tmpl update my-scenario.yaml
```

## Next Steps

- **[Authentication Guide](authentication.md)** - Detailed authentication setup
- **[Configuration](configuration.md)** - Client configuration options
- **[Examples](examples.md)** - Real-world usage examples
- **[Troubleshooting](troubleshooting.md)** - Common issues and solutions