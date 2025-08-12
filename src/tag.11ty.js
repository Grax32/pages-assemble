/**
 * 11ty template for generating tag pages
 * Creates individual pages for each tag showing all posts with that tag
 */

/**
 * Converts a string to a URL-friendly slug
 * @param {string} str - The string to slugify
 * @returns {string} - URL-friendly slug
 */
const slugify = str => str
  .toString()
  .toLowerCase()
  .replace(/\s+/g, '-')        // Replace spaces with hyphens
  .replace(/_/g, '-')          // Replace underscores with hyphens
  .replace(/[^\w\-]+/g, '')    // Remove non-word characters except hyphens
  .replace(/\-\-+/g, '-')      // Replace multiple hyphens with single hyphen
  .replace(/^-+/, '')          // Remove leading hyphens
  .replace(/-+$/, '');         // Remove trailing hyphens

module.exports = {
  data() {
    return {
      pagination: {
        data: "collections.tagList",
        size: 1,
        alias: "tag"
      },
      
      permalink(data) {
        const slug = slugify(data.tag);
        return `/tag/${slug}/index.html`;
      },
      
      eleventyComputed: {
        title(data) {
          return `Posts tagged "${data.tag}"`;
        },
        
        tagPosts(data) {
          return data.collections[data.tag] || [];
        }
      },
      
      layout: "tag.njk"
    };
  }
};
