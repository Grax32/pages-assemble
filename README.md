# Custom Static Site

A static site generator built with 11ty (Eleventy).

## Getting Started

```bash
# Install dependencies
npm install

# Start development server with live reload
npm run dev

# Build for production
npm run build

# Clean build directory
npm run clean
```

## Project Structure

```
src/                    # Source files
├── _layouts/          # Nunjucks layouts
├── _includes/         # Reusable template includes  
├── articles/          # Blog posts and articles
├── content/           # CSS, JS, and other assets
├── data/              # Global data files (JSON)
├── images/            # Image assets
└── ...                # Pages and other content

_site/                 # Generated site (output)
.eleventy.js          # Eleventy configuration
```

## Development

- **Source**: `src/`
- **Output**: `_site/`
- **Dev Server**: http://localhost:8081/
- **Template Engine**: Nunjucks + Markdown
- **Static Assets**: Automatically copied from `src/content/` and `src/images/`

## Scripts

- `npm run dev` - Start development server with live reload
- `npm run build` - Build production site  
- `npm run clean` - Clean output directory
- `npm run serve` - Serve built site (production)
