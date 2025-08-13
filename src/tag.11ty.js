/**
 * 11ty template for generating tag pages
 * Creates individual pages for each tag showing all posts with that tag
 */


const { slugifyTag } = require("./utils/functions");

module.exports = {
  data() {
    return {
      pagination: {
        data: "collections.tagList",
        size: 1,
        alias: "tag"
      },
      
      permalink(data) {
        const slug = slugifyTag(data.tag);
        return `/tag/${slug}/`;
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
