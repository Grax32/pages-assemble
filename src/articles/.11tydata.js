// This .11tydata.js file ensures that any article in this folder with a `route` or `alternateRoutes` frontmatter field
// will have its output path(s) set accordingly using Eleventy's `permalink` feature.
// If both are present, all routes will be generated for the same content.

module.exports = function (data) {
    console.log('data', JSON.stringify(data, null, 2));
    if (data.route) {
        if (Array.isArray(data.alternateRoutes) && data.alternateRoutes.length > 0) {
            return {
                permalink: [data.route, ...data.alternateRoutes]
            }; 
        }
        return {
            permalink: data.route
        };
    }
    return {};
};
