const slugify = require("slugify");

// Utility functions for the site

function slugifyTag(tag) {
  const slug = slugify(tag, { lower: true, strict: true });
  return slug;
}

module.exports = {
  slugifyTag
};
