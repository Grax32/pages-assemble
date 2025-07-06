# Migration from Pages-Assemble to 11ty (Eleventy)

This guide will help you migrate your static site from your custom Pages-Assemble system to 11ty (Eleventy).

## What's Been Done

1. **Created 11ty Configuration** (`.eleventy.js`)
   - Configured input/output directories
   - Set up Nunjucks as the template engine
   - Added collections for articles and pages
   - Set up static file copying

2. **Converted Base Templates**
   - `base.vash` → `base.njk`
   - `pages.vash` → `pages.njk`
   - Updated template syntax from Vash to Nunjucks

3. **Converted Content Files**
   - `index.vash` → `index.njk`
   - `contact.md` → `contact.njk`
   - Updated layout references

4. **Created New Package.json** (`package-eleventy.json`)
   - Added 11ty dependencies
   - Updated build scripts

## Migration Steps

### 1. Install 11ty Dependencies

```bash
# Backup your current package.json
cp package.json package-original.json

# Replace with the new package.json
cp package-eleventy.json package.json

# Install dependencies
npm install
```

### 2. Convert Remaining Vash Templates

Run the migration script to convert remaining `.vash` files:

```bash
node migrate-vash-to-njk.js
```

**Important:** This script provides a starting point but you'll need to manually review and adjust the generated `.njk` files, especially:
- Complex template logic
- Collection loops
- Data access patterns
- Layout inheritance

### 3. Update Layout References

Update all your content files to use the new layout names:
- `layout: pages` → `layout: pages.njk`
- `layout: base` → `layout: base.njk`

### 4. Handle Data Files

Your data files in `static-basedir/static-source/data/` will be automatically available in 11ty. The software projects data is already configured.

### 5. Collections Configuration

Collections are configured in `.eleventy.js`:
- `collections.articles` - All markdown files in the articles directory
- `collections.pages` - All content files (excluding partials that start with `_`)

### 6. Test the Build

```bash
# Clean build directory
npm run clean

# Build the site
npm run build

# Serve locally with live reload
npm run serve
```

## Template Syntax Changes

### Vash → Nunjucks

| Vash | Nunjucks |
|------|----------|
| `@model.title` | `{{ title }}` |
| `@if (condition) { ... }` | `{% if condition %} ... {% endif %}` |
| `@array.forEach(item => { ... })` | `{% for item in array %} ... {% endfor %}` |
| `@html.raw(content)` | `{{ content \| safe }}` |
| `@html.extend('base', ...)` | `layout: base.njk` in frontmatter |

### Collections Usage

```njk
<!-- List all articles -->
{% for article in collections.articles %}
  <a href="{{ article.url }}">{{ article.data.title }}</a>
{% endfor %}

<!-- Access global data -->
{% for project in softwareprojects %}
  {{ project.name }}
{% endfor %}
```

## File Structure

```
.eleventy.js                    # 11ty configuration
static-basedir/
├── static-source/              # Source files (input)
│   ├── _layouts/              # Layout templates
│   │   ├── base.njk          # Base layout
│   │   └── pages.njk         # Pages layout
│   ├── _data/                 # Global data files
│   ├── articles/              # Article markdown files
│   ├── index.njk             # Home page
│   └── contact.njk           # Contact page
└── build/                     # Generated site (output)
```

## Next Steps

1. **Review Generated Templates**: Check all converted `.njk` files for accuracy
2. **Test All Pages**: Ensure all pages render correctly
3. **Update Collections**: Add any missing collections in `.eleventy.js`
4. **Add Filters**: Create custom filters for any special formatting needs
5. **Setup Deployment**: Configure your deployment process (Netlify, Vercel, etc.)

## Additional Features You Can Add

- **Image Optimization**: Use `@11ty/eleventy-img` plugin
- **Navigation**: Use `@11ty/eleventy-navigation` plugin
- **RSS Feed**: Generate RSS feeds for your articles
- **Search**: Add client-side search functionality
- **SEO**: Add meta tags and structured data

## Troubleshooting

- **Template Errors**: Check the console for specific Nunjucks syntax errors
- **Missing Data**: Ensure data files are in the correct location
- **Collection Issues**: Verify glob patterns in `.eleventy.js`
- **Static Files**: Check passthrough copy configuration

For more information, see the [11ty documentation](https://www.11ty.dev/docs/).
