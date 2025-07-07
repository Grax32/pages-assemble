module.exports = class {
  data() {
    return {
      pagination: {
        data: "collections.tagList",
        size: 1,
        alias: "tag"
      },
      permalink: data => `tag/${data.tag}/index.html`,
      eleventyComputed: {
        title: data => `Posts tagged '${data.tag}'`
      },
      layout: null // No layout, pure HTML output
    };
  }

  render(data) {
    const tagName = String(data.tag);
    const tagKey = tagName;
    const posts = data.collections[tagKey] || data.collections[tagName] || [];
    return `
      <h1>Posts tagged "${tagName}"</h1>
      <p>${posts.length} article${posts.length === 1 ? "" : "s"} found.</p>
      <ul>
        ${posts.map(post => `<li><a href="${post.url}">${post.data.title}</a></li>`).join("\n")}
      </ul>
    `;
  }
};
