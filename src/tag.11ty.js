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

const tagPage = {
  data() {
    return {
      pagination: {
        data: "collections.tagList",
        size: 1,
        alias: "tag"
      },
      permalink(data) {
        // DEBUG: Output current tag and slug
        console.log("[DEBUG] Generating tag page for:", data.tag);
        const slug = slugify(data.tag);
        console.log("[DEBUG] Slug for tag:", slug);
        return `/tag/${slug}/index.html`;
      },
      eleventyComputed: {
        tagPosts(data) {
          // DEBUG: Output all collection keys
          console.log("[DEBUG] data.collections keys:", Object.keys(data.collections));
          // DEBUG: Output posts for this tag
          const posts = data.collections[data.tag] || [];
          console.log(`[DEBUG] Posts for tag '${data.tag}':`, posts.map(p => p.inputPath));
          return posts;
        }
      },
      layout: "tag.njk",
      title: data => `Posts tagged “${data.tag}”`
    };
  },
  render(data) {
    const tagName = String(data.tag);
    const posts = data.collections[tagName] || [];
    return `
      <h1>Posts tagged "${tagName}"</h1>
      <p>${posts.length} article${posts.length === 1 ? "" : "s"} found.</p>
      <ul>
        ${posts.map(post => `<li><a href="${post.url}">${post.data.title}</a></li>`).join("\n")}
      </ul>
    `;
  }
};

module.exports = tagPage;
