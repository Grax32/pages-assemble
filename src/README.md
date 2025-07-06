---
{
    outputType: "text"
}
---
# Grax32.com - Modern Static Site

A professional static site built with [11ty (Eleventy)](https://11ty.dev), featuring a fine art gallery, technical articles, and project showcase.

## Features

- 🎨 **Dreamwalker Art Gallery** - Professional fine art exhibition with detailed artwork metadata
- 📝 **Technical Articles** - In-depth programming and technology content
- 🚀 **Modern Build System** - Lightning-fast builds with 11ty v3
- 📱 **Responsive Design** - Mobile-first, accessible design
- 🔧 **Minimal Dependencies** - Clean, secure, maintainable codebase

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

## Project Structure

```text
src/
├── _layouts/          # Nunjucks templates
├── _includes/         # Reusable components
├── articles/          # Blog posts and articles
├── art/              # Art gallery content
├── data/             # Site data (JSON)
├── images/           # Static images
└── content/          # CSS, JS, and other assets
```

## Technology Stack

- **Static Site Generator**: 11ty (Eleventy) v3
- **Templates**: Nunjucks
- **Content**: Markdown + YAML frontmatter
- **Styling**: CSS3 with modern features
- **Build**: Node.js with minimal dependencies

## Development

The site uses a clean, minimal dependency approach:

- **Core**: 11ty + Markdown-it for content processing
- **Dev Tools**: Prettier for code formatting, Serve for testing
- **Zero Build Complexity**: No TypeScript, Webpack, or complex build chains

## Deployment

- **Production Build**: `npm run build`
- **Output**: `_site/` directory
- **Netlify Ready**: Automatic deployment configuration

## About

Built with ❤️ and modern web standards

