const markdownIt = require("markdown-it");

module.exports = async function(eleventyConfig) {
  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  
  // Allow overriding reserved data properties
  eleventyConfig.setFreezeReservedData(false);
  
  // Add plugins
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Configure Nunjucks to not auto-escape HTML
  eleventyConfig.setNunjucksEnvironmentOptions({
    autoescape: false
  });

  // Configure Markdown
  const md = markdownIt({
    html: true,
    breaks: false,
    linkify: true
  });
  eleventyConfig.setLibrary("md", md);

  // Copy static files (matching your system's static patterns)
  eleventyConfig.addPassthroughCopy("src/**/*.{jpg,png,gif,ico,pdf,svg,eot,ttf,woff,woff2}");
  eleventyConfig.addPassthroughCopy("src/robots.txt");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/content");
  eleventyConfig.addPassthroughCopy("src/images");

  // Watch for changes
  eleventyConfig.addWatchTarget("src/**/*.css");
  eleventyConfig.addWatchTarget("src/**/*.js");

  // Add layout aliases (matching your Vash template names)
  eleventyConfig.addLayoutAlias("pages", "pages.njk");
  eleventyConfig.addLayoutAlias("base", "base.njk");
  eleventyConfig.addLayoutAlias("redirect", "redirect.njk");
  eleventyConfig.addLayoutAlias("art-exhibit", "art-exhibit.njk");
  eleventyConfig.addLayoutAlias("resume", "resume.njk");
  eleventyConfig.addLayoutAlias("show-collection", "show-collection.njk");

  // Add custom filters
  eleventyConfig.addFilter("dateToISO", (date) => {
    return new Date(date).toISOString();
  });

  // Add a filter to get category description (matching your system's logic)
  eleventyConfig.addFilter("getCategoryDescription", function(category, sitedata) {
    if (!category || !sitedata) return category;
    const categoryData = sitedata.find(d => d.category === category);
    return categoryData ? categoryData.display : category;
  });

  // Add a filter to get collection by page tag (matching your getCollection logic)
  eleventyConfig.addFilter("getCollection", function(collections, pageTag) {
    if (!pageTag) return [];
    
    // Handle specific page collection patterns
    if (pageTag === 'page:home') {
      return collections.homeArticles || [];
    }
    
    return [];
  });

  // Add relative URL filter for navigation
  eleventyConfig.addFilter('getRelativeUrl', (collection, currentPage, offset) => {
    if (!collection || !currentPage) return '';
    
    const currentIndex = collection.findIndex(item => item.url === currentPage.url);
    if (currentIndex === -1) return '';
    
    const targetIndex = currentIndex + offset;
    if (targetIndex < 0 || targetIndex >= collection.length) return '';
    
    return collection[targetIndex].url;
  });

  // Add safe filter
  eleventyConfig.addFilter('safe', (content) => content);

  // Add shortcodes
  eleventyConfig.addShortcode("buildtime", () => {
    return new Date().toISOString();
  });

  // Collections (matching your system's categorization)
  
  // All articles collection
  eleventyConfig.addCollection("articles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md").sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
  });

  // Articles by category
  eleventyConfig.addCollection("articles_tech", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.category === 'tech')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("articles_team", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.category === 'team')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("articles_opinion", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.category === 'opinion')
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // More specific tech collections
  eleventyConfig.addCollection("csharp", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.tags && item.data.tags.includes('csharp'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("sqlserver", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.tags && item.data.tags.includes('sql-server'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("azure", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.tags && item.data.tags.includes('azure'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("css", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.tags && item.data.tags.includes('css'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("team", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.tags && item.data.tags.includes('team'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  eleventyConfig.addCollection("opinion", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.tags && item.data.tags.includes('opinion'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Other tech collection (tech but not in specific subcategories)
  eleventyConfig.addCollection("otherTech", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => {
        if (!item.data.tags) return false;
        const hasTech = item.data.tags.includes('tech');
        const hasSpecificTech = item.data.tags.some(tag => 
          ['css', 'sql-server', 'azure', 'csharp'].includes(tag)
        );
        return hasTech && !hasSpecificTech;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Art collection
  eleventyConfig.addCollection("art", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/art/**/*.{md,njk}")
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Archives collection
  eleventyConfig.addCollection("archives", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.systemTags && item.data.systemTags.includes('archive'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Home page articles (matching your system's "page:home" logic)
  eleventyConfig.addCollection("homeArticles", function(collectionApi) {
    return collectionApi.getFilteredByGlob("**/articles/*.md")
      .filter(item => item.data.systemTags && item.data.systemTags.includes('page:home'))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  });

  // Tag collections
  eleventyConfig.addCollection("tagList", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  });

  // All tags collection for the tags page
  eleventyConfig.addCollection("allTags", function(collectionApi) {
    const tagSet = new Set();
    collectionApi.getAll().forEach(item => {
      if (item.data.tags) {
        item.data.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort().map(tag => ({
      data: { title: tag },
      url: `/tag/${tag}/`
    }));
  });

  // Archive collections by year
  eleventyConfig.addCollection("archiveByYear", function(collectionApi) {
    const posts = collectionApi.getFilteredByGlob("**/articles/*.md");
    const years = {};
    
    posts.forEach(post => {
      const year = new Date(post.date).getFullYear();
      if (!years[year]) {
        years[year] = [];
      }
      years[year].push(post);
    });

    return years;
  });

  // Global data (matching your dataStore)
  eleventyConfig.addGlobalData("softwareprojects", () => {
    try {
      return require("./src/data/softwareprojects.json");
    } catch (e) {
      return [];
    }
  });

  eleventyConfig.addGlobalData("sitedata", () => {
    try {
      return require("./src/data/sitedata.json");
    } catch (e) {
      return [
        { category: "tech", display: "Technology" },
        { category: "team", display: "Teamwork" },
        { category: "opinion", display: "Opinion" },
        { category: "home", display: "Home" }
      ];
    }
  });

  return {
    // Configure directories (standard 11ty structure)
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data"
    },
    
    // Configure template formats
    templateFormats: ["md", "njk", "html"],
    
    // Configure template engines
    markdownTemplateEngine: false,
    htmlTemplateEngine: "njk",
    
    // Configure path prefix
    pathPrefix: "/"
  };
};
