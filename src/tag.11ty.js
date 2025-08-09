// Export a plain object for 11ty v3 compatibility
const slugify = str => str
  .toString()
  .toLowerCase()
  .replace(/\s+/g, '-')
  .replace(/_/g, '-')
  .replace(/[^\w\-]+/g, '')
  .replace(/\-\-+/g, '-')
  .replace(/^-+/, '')
  .replace(/-+$/, '');

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
