---
layout: pages
route: /articles/migrating-from-custom-static-site-to-11ty.html
title: Migrating from a Custom Static Site Generator to 11ty
tags: [ web-development, 11ty, static-site-generators, migration, typescript, vash ]
category: tech
date: 2025-07-07
---

After years of maintaining a custom TypeScript-based static site generator, I recently made the decision to migrate to [11ty (Eleventy)](https://www.11ty.dev/). This article chronicles the journey, challenges, and lessons learned during this migration.

## The Original Setup

My original static site generator was built with:

- **TypeScript** for the build system and logic
- **Vash** templating engine for layouts and pages
- **Custom build modules** for different content types
- **Custom routing and file processing**

While this setup gave me complete control, it also meant:

- **Maintenance overhead** - keeping dependencies updated and fixing breaking changes
- **I'm my only support** - debugging issues was mostly on my own
- **Reinventing the wheel** - implementing features that other generators already had

## Why 11ty?

I chose 11ty for several compelling reasons:

### 1. **Template Engine Flexibility**

11ty supports multiple template engines (Nunjucks, Liquid, Markdown, HTML, etc.), which made migration easier since I could choose the best fit for each content type.

### 2. **Zero-Config Philosophy**

Unlike complex frameworks, 11ty works out of the box with sensible defaults, but still allows deep customization when needed.

### 3. **Performance**

11ty is incredibly fast, both in build times and the resulting static sites.

### 4. **Active Community**

Strong community support, regular updates, and excellent documentation.

## The Migration Process

### Phase 1: Project Structure Reorganization

The first step was restructuring the project to match 11ty conventions:

```text
Before:
├── src/
│   ├── modules/
│   ├── interfaces/
│   └── services/
├── static-basedir/
│   └── static-source/
└── plugins/

After:
├── src/
│   ├── _layouts/
│   ├── _includes/
│   ├── articles/
│   ├── art/
│   └── data/
├── .eleventy.js
└── package.json
```

### Phase 2: Template Migration

Converting from Vash to Nunjucks was surprisingly straightforward:

**Vash (Before):**

```html
<h1>@model.title</h1>
@if(model.imgPath) {
  <img src="@model.imgPath" alt="@model.title" />
}
```

**Nunjucks (After):**

```html
<h1>{{ title }}</h1>
{% if imgPath %}
  <img src="{{ imgPath }}" alt="{{ title }}" />
{% endif %}
```

### Phase 3: Data and Collections

One of 11ty's strongest features is its data cascade and collections system. I migrated my custom content processing to use 11ty's built-in collections:

```javascript
// .eleventy.js
module.exports = function(eleventyConfig) {
  // Custom collection for art pieces
  eleventyConfig.addCollection("art", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/art/**/*.md");
  });

  // Custom filters
  eleventyConfig.addFilter("getRelativeUrl", function(collection, page, direction) {
    // Navigation logic
  });
};
```

### Phase 4: Build Information System

I implemented a robust build info system that captures:

- Git commit information
- Build timestamp
- Version information
- Environment details

```javascript
// src/data/buildInfo.js
const { execSync } = require('child_process');

function safeExecSync(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.warn(`Git command error (${command}): ${error.message}`);
    return null;
  }
}

module.exports = {
  timestamp: new Date().toISOString(),
  git: {
    branch: safeExecSync('git rev-parse --abbrev-ref HEAD'),
    commit: safeExecSync('git rev-parse HEAD'),
    shortCommit: safeExecSync('git rev-parse --short HEAD'),
    tag: safeExecSync('git describe --tags --abbrev=0'),
    isDirty: safeExecSync('git diff --quiet') === null
  },
  version: process.env.npm_package_version || 'unknown'
};
```

## Key Challenges and Solutions

### 1. **Asset Management**

**Challenge:** My custom system had complex asset processing.
**Solution:** Used 11ty's `addPassthroughCopy` for static assets and custom filters for dynamic processing.

### 2. **URL Structure Preservation**

**Challenge:** Maintaining existing URLs for SEO.
**Solution:** Used 11ty's `permalink` frontmatter and `alternateRoutes` for redirects.

### 3. **Art Gallery Functionality**

**Challenge:** Complex image gallery with navigation and metadata.
**Solution:** Created custom shortcodes and used 11ty's data cascade for artwork metadata.

## Performance Improvements

The migration resulted in significant performance gains:

- **Build time:** Reduced from ~15 seconds to ~2 seconds
- **Bundle size:** Eliminated unnecessary JavaScript dependencies
- **Development server:** Hot reload is nearly instantaneous

## Lessons Learned

### 1. **Start with Data Structure**

Get your data organization right first. 11ty's data cascade is powerful but requires thoughtful planning.

### 2. **Embrace 11ty's Conventions**

Fighting against 11ty's conventions leads to more complex code. Work with the framework, not against it.

### 3. **Incremental Migration**

Don't try to migrate everything at once. I kept both systems running in parallel during the transition.

### 4. **Test Everything**

Static site generators can have subtle differences in how they handle edge cases. Comprehensive testing is crucial.

## Final Thoughts

The migration to 11ty was absolutely worth it. While I initially had concerns about giving up the control of my custom system, 11ty's flexibility and performance more than compensated for any lost customization.

**Key benefits realized:**

- **Faster development** - no more debugging custom build systems
- **Better performance** - both build times and runtime
- **Future-proof** - active community and regular updates
- **Less maintenance** - focus on content, not infrastructure

If you're maintaining a custom static site generator, I highly recommend evaluating 11ty. The migration effort is manageable, and the long-term benefits are substantial.

## 11ty Resources

- [11ty Documentation](https://www.11ty.dev/docs/)
- [11ty Data Cascade](https://www.11ty.dev/docs/data-cascade/)
- [Migration Guide](https://www.11ty.dev/docs/migration/)
