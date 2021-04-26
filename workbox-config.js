module.exports = {
  globDirectory: "dist",
  globPatterns: ["**/*.{js,css,svg}", "index.html"],
  swSrc: "public/sw.generated.js",
  swDest: "dist/sw.generated.js",
  maximumFileSizeToCacheInBytes: 10000000, // 10 MB,
};
