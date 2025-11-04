# OpenAPI Specification

This page provides the interactive OpenAPI (Swagger) specification for the Hot Fixture Tool server API. You can explore all endpoints, test requests, and see response examples directly in your browser.

## Interactive API Explorer

<swagger-ui src="../../../hfitd/docs/swagger.yaml"/>

## Download Specifications

You can download the OpenAPI specification in different formats:

- **[OpenAPI YAML](../../../hfitd/docs/swagger.yaml)** - Human-readable YAML format
- **[OpenAPI JSON](../../../hfitd/docs/swagger.json)** - Machine-readable JSON format

## Using the API Explorer

### Authentication

To test the API endpoints in the Swagger UI:

1. **Get an authentication token** using your hfit client:
   ```bash
   hfit login
   # Authentication successful! Token saved to ~/.hfit/token
   
   # Get your token
   cat ~/.hfit/token
   ```

2. **Authorize in Swagger UI**:
   - Click the "Authorize" button at the top of the API explorer
   - Enter your JWT token in the format: `Bearer your-jwt-token-here`
   - Click "Authorize"

3. **Test endpoints**:
   - Expand any endpoint section
   - Click "Try it out"
   - Fill in required parameters
   - Click "Execute"

### Example Workflows

#### Database Exploration
1. **List DBMS Providers**: `GET /api/v1/db/dbmss`
2. **List Databases**: `GET /api/v1/db/{provider}/dbs`
3. **List Tables**: `GET /api/v1/db/{provider}/{database}/tables`
4. **Stream Data**: `GET /api/v1/db/{provider}/{database}/{table}/rows`

#### File Operations
1. **Browse Volume**: `GET /api/v1/files/{volume}`
2. **Download File**: `GET /api/v1/files/{volume}/download`

#### Template Management
1. **List Templates**: `GET /api/v1/packtmpl`
2. **Get Template**: `GET /api/v1/packtmpl/{template_name}`
3. **Create Template**: `POST /api/v1/packtmpl`
4. **Generate Package**: `POST /api/v1/packdownload`

## Code Generation

The OpenAPI specification can be used to generate client libraries in various programming languages:

### Generate Go Client
```bash
# Install OpenAPI Generator
npm install -g @openapitools/openapi-generator-cli

# Generate Go client
openapi-generator-cli generate \
  -i https://your-hfitd-server.com/swagger/swagger.yaml \
  -g go \
  -o ./hfit-go-client \
  --additional-properties=packageName=hfitclient
```

### Generate Python Client
```bash
# Generate Python client
openapi-generator-cli generate \
  -i https://your-hfitd-server.com/swagger/swagger.yaml \
  -g python \
  -o ./hfit-python-client \
  --additional-properties=packageName=hfit_client
```

### Generate JavaScript Client
```bash
# Generate JavaScript/TypeScript client
openapi-generator-cli generate \
  -i https://your-hfitd-server.com/swagger/swagger.yaml \
  -g typescript-axios \
  -o ./hfit-js-client
```

## API Versioning

The Hot Fixture Tool API follows semantic versioning:

- **Current Version**: v1
- **Base Path**: `/api/v1`
- **Backward Compatibility**: Maintained within major versions
- **Deprecation Policy**: 6 months notice for breaking changes

### Version Headers

Include version information in your requests:

```http
GET /api/v1/db/dbmss
Accept: application/json
API-Version: v1
User-Agent: hfit-client/1.0.0
```

## Rate Limiting Information

The API implements rate limiting with the following default limits:

- **60 requests per minute** per IP address
- **Rate limit headers** included in responses:
  - `X-RateLimit-Limit`: Total request limit
  - `X-RateLimit-Remaining`: Remaining requests in current window
  - `X-RateLimit-Reset`: Unix timestamp when the window resets

## Error Response Format

All API errors follow a consistent structure:

```json
{
  "category": "ERROR_CATEGORY",
  "code": "SPECIFIC_ERROR_CODE", 
  "message": "Human-readable error message",
  "details": "Additional technical information",
  "resource": "affected-resource-identifier",
  "suggestions": [
    "Actionable suggestion 1",
    "Actionable suggestion 2"
  ],
  "timestamp": "1699027200"
}
```

### Common Error Categories

- `NOT_FOUND`: Resource not found (404)
- `AUTHENTICATION`: Authentication required/failed (401)
- `PERMISSION_DENIED`: Access forbidden (403)
- `VALIDATION_ERROR`: Invalid request data (400)
- `RATE_LIMIT`: Rate limit exceeded (429)
- `CONNECTION`: Infrastructure connection issues (500)
- `INTERNAL_ERROR`: Server-side errors (500)

## WebSocket Endpoints

For real-time operations, the following WebSocket endpoints are available:

### Package Generation Progress
- **Endpoint**: `wss://your-server.com/ws/package-progress`
- **Authentication**: JWT token required
- **Purpose**: Real-time progress updates for large package generation

### File Download Progress  
- **Endpoint**: `wss://your-server.com/ws/download-progress`
- **Authentication**: JWT token required
- **Purpose**: Progress updates for large file downloads

## Health and Status Endpoints

### Health Check
```http
GET /health
```
Returns server health status (no authentication required).

### Version Information
```http
GET /version
```
Returns server version and build information.

### Metrics (Admin Only)
```http
GET /metrics
Authorization: Bearer <admin-token>
```
Returns Prometheus-compatible metrics.

## Security Features

### Authentication
- **SSH Key-based**: Challenge-response authentication
- **JWT Tokens**: Time-limited access tokens
- **Multiple Key Types**: RSA, ECDSA, Ed25519 support

### Authorization
- **User-based Access**: Resources scoped to authenticated users
- **Template Ownership**: Users can only access their own templates
- **Volume Permissions**: Configurable file system access controls

### Data Protection
- **HTTPS Only**: All communications encrypted in transit
- **No Sensitive Data Exposure**: Error messages sanitized
- **Audit Logging**: All access attempts logged
- **Rate Limiting**: Protection against abuse

## Development and Testing

### Local Development
For local development and testing, you can access the Swagger UI at:
```
http://localhost:8080/swagger/
```

### Mock Server
Generate a mock server for testing:
```bash
# Generate mock server
openapi-generator-cli generate \
  -i swagger.yaml \
  -g nodejs-express-server \
  -o ./mock-server

# Run mock server
cd mock-server && npm install && npm start
```

### Postman Collection
Import the OpenAPI specification into Postman:
1. Open Postman
2. Click "Import"
3. Select "Link" tab
4. Enter: `https://your-hfitd-server.com/swagger/swagger.yaml`
5. Click "Continue" and "Import"

## Support and Documentation

- **API Reference**: [Complete API documentation](overview.md)
- **Client Installation**: [Install the official CLI client](../client/installation.md)
- **Examples**: [Real-world usage examples](../client/examples.md)
- **Issues**: [Report API issues on GitHub](https://github.com/danielecr/hot-fixture-tool/issues)