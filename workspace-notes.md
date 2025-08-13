# Workspace Notes for pages-assemble

## Root Directory
- `.eleventy.js`: Main Eleventy config. Sets up plugins, filters, collections, passthrough copy, and directory structure. No custom routing logic for `route` or `alternateRoutes` yet.
- `package.json`: Project dependencies and scripts for build/dev.
- `README.md`: Project overview, structure, and usage instructions.
- `_site/`: Output directory for generated static site.
- `scripts/`: Contains utility scripts (e.g., `check-port.js`).
- `src/`: Main content and templates for the site.
- `test/`: Contains tests (e.g., `dead-links.test.js`).

## src/
- `_layouts/`: Nunjucks layout templates (e.g., `pages.njk`, `base.njk`).
- `_includes/`: Nunjucks includes/components.
- `articles/`: Markdown and Nunjucks files for articles/blog posts. Many have frontmatter with `route` and `alternateRoutes` fields, but these are not yet respected by Eleventy.
- `data/`: Global data files (JSON/JS) for site-wide use.
- `images/`, `content/`: Static assets.
- `README.md`: Project-specific documentation.

## src/articles/
- Markdown files for articles, each with frontmatter. Some use `route` and `alternateRoutes` for intended output paths.
- Nunjucks files for category pages (e.g., `archive.njk`, `art.njk`).
- No `.11tydata.js` file present to map `route`/`alternateRoutes` to Eleventy's `permalink`.

## test/
- `dead-links.test.js`: Script to check for dead links in the generated site. Walks the output directory, parses HTML, and checks local and remote links.

## Current Gaps/To-Do
- No code currently maps `route` or `alternateRoutes` to Eleventy's `permalink` (needed for correct routing).
- The Eleventy config is mostly standard, with custom collections and filters, but no routing overrides.
- Articles and pages are being output based on file structure, not frontmatter routes.
- The site is partially converted to Eleventy; some legacy or placeholder logic may remain.

## Recommendation
- Add a `.11tydata.js` file in `src/articles/` to map `route` and `alternateRoutes` to `permalink` for all articles.
- Review and update any legacy logic as the conversion to Eleventy continues.
