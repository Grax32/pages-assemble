# pages-assemble (Angular)

This repository has been migrated from Eleventy to Angular.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server (port 8081)
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/                    # Angular app source
├── app/                # Components and routed pages
├── assets/             # Runtime assets (e.g., softwareprojects.json)
├── index.html          # Angular host page
├── main.ts             # Angular bootstrap
└── styles.css          # Global styles

legacy-src/             # Original Eleventy/Nunjucks content preserved for migration reference
angular.json            # Angular CLI workspace configuration
```

## Current Migration Status

- ✅ Angular shell, routing, and top-level pages (`/`, `/contact`, `/software-projects`) are migrated.
- ✅ Software project data is loaded from JSON via Angular `HttpClient`.
- ✅ Legacy static assets are still copied into the Angular build output.
- ⏳ Remaining article/art detail routes can be migrated incrementally from `legacy-src/`.

## Scripts

- `npm run dev` - Start Angular development server on port `8081`
- `npm run build` - Build the Angular app
- `npm run test` - Build in development mode as a CI sanity check
