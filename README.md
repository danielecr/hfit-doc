# Documentation Setup

This directory contains the complete documentation for Hot Fixture Tool using MkDocs Material.

## Quick Start

### Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or use a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Serve Documentation Locally

```bash
# Start development server
mkdocs serve

# Documentation will be available at http://localhost:8000
```

### Build Static Documentation

```bash
# Build static site
mkdocs build

# Output will be in site/ directory
```

### Generate PDF

```bash
# Build with PDF export
mkdocs build

# PDF will be generated as hot-fixture-tool-complete-documentation.pdf
```

## Documentation Structure

```
doc/
├── mkdocs.yml              # MkDocs configuration
├── requirements.txt        # Python dependencies
├── docs/                   # Documentation source
│   ├── index.md           # Homepage
│   ├── getting-started/   # Getting started guides
│   ├── server/            # Server documentation
│   ├── client/            # Client documentation
│   ├── guides/            # Detailed guides
│   └── api/               # API reference
└── site/                  # Generated static site (after build)
```

## Updating Documentation

### Adding New Pages

1. Create markdown files in appropriate directories
2. Update navigation in `mkdocs.yml`
3. Test locally with `mkdocs serve`
4. Commit changes

### Updating API Documentation

The API documentation automatically references the Swagger/OpenAPI specification from `../hfitd/docs/swagger.yaml`. When you update the server API:

1. Update Swagger annotations in Go code
2. Regenerate swagger.yaml (if using swaggo)
3. Documentation will automatically reflect changes

### Adding Images

Place images in a `docs/images/` directory:

```markdown
![Architecture Diagram](images/architecture.png)
```

## Deployment

### GitHub Pages (Automatic)

Create `.github/workflows/docs.yml`:

```yaml
name: Documentation
on:
  push:
    branches: [main]
    paths: ['doc/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-python@v3
        with:
          python-version: 3.x
      - run: pip install -r doc/requirements.txt
      - run: mkdocs gh-deploy --config-file doc/mkdocs.yml --remote-branch gh-pages
```

### Manual Deployment

```bash
# Deploy to GitHub Pages
mkdocs gh-deploy

# Deploy to custom server
mkdocs build
rsync -av site/ user@server:/var/www/docs/
```

## Customization

### Theme Customization

Edit `mkdocs.yml` to customize:
- Colors and fonts
- Navigation structure  
- Features and extensions
- Social links

### Custom CSS

Add custom styles:

1. Create `docs/stylesheets/extra.css`
2. Add to `mkdocs.yml`:
```yaml
extra_css:
  - stylesheets/extra.css
```

### Custom JavaScript

Add custom scripts:

1. Create `docs/javascripts/extra.js`
2. Add to `mkdocs.yml`:
```yaml
extra_javascript:
  - javascripts/extra.js
```

## Content Guidelines

### Writing Style

- Use clear, concise language
- Include code examples for technical concepts
- Provide both basic and advanced usage patterns
- Use admonitions for important notes

### Code Examples

Use proper syntax highlighting:

```bash
# Shell commands
hfit login
```

```yaml
# YAML configuration
templateName: example
hfitVersion: "1.0"
```

```json
# JSON responses
{
  "status": "success",
  "data": []
}
```

### Admonitions

Use admonitions for important information:

```markdown
!!! note "Information"
    This is an informational note.

!!! warning "Warning"
    This is a warning message.

!!! tip "Pro Tip"
    This is a helpful tip.

!!! danger "Important"
    This is critical information.
```

## Maintenance

### Regular Updates

- Review and update content quarterly
- Check for broken links
- Update version information
- Refresh screenshots and examples

### Link Checking

```bash
# Install linkchecker
pip install linkchecker

# Check for broken links
linkchecker http://localhost:8000
```

### Performance

- Optimize images before adding
- Keep pages reasonably sized
- Use proper heading hierarchy
- Include search-friendly content

## Support

- **MkDocs Documentation**: https://www.mkdocs.org/
- **Material Theme**: https://squidfunk.github.io/mkdocs-material/
- **Project Issues**: https://github.com/danielecr/hot-fixture-tool/issues