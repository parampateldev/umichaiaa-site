// Builds the site into /dist. Content comes from Sanity when configured, otherwise from src/_data/seed.json.
module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/static": "." });
  eleventyConfig.addWatchTarget("src/static");
  return {
    dir: { input: "src", output: "dist", includes: "_includes", data: "_data" },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk",
  };
};
