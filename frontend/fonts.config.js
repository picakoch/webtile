// Fonts a site can use, chosen per site in frontend/.env:
//
//   VITE_FONT_TITLE=Abel           headings, menu, tile titles
//   VITE_FONT_TEXT=Abel            everything else
//
// (VUE_APP_FONT_TITLE / VUE_APP_FONT_TEXT work too.) Only the chosen fonts
// are bundled, self-hosted: no request to Google, files cached with the
// rest of the build. The site's CSS uses them as var(--font-title) and
// var(--font-text) (see the vite.config.js plugin).
//
// To add a font: `yarn add @fontsource/<name>` and list the CSS files of
// the weights/styles the site needs (400 normal text, 600 menu, 700 bold,
// 400-italic italic text), or add the files under src/assets/fonts.

export const DEFAULT_FONTS = {
  title: "Augustus",
  text: "Times New Roman",
};

export const FONTS = {
  Augustus: {
    files: ["/src/assets/fonts/augustus.css"],
    fallback: '"Times New Roman", Times, serif',
  },
  // System font: nothing to download
  "Times New Roman": {
    files: [],
    fallback: "Times, serif",
  },
  Abel: {
    files: ["@fontsource/abel/400.css"],
    fallback: "Helvetica, Arial, sans-serif",
  },
  Roboto: {
    files: [
      "@fontsource/roboto/400.css",
      "@fontsource/roboto/400-italic.css",
      "@fontsource/roboto/500.css",
      "@fontsource/roboto/700.css",
    ],
    fallback: "Helvetica, Arial, sans-serif",
  },
  "Crimson Text": {
    files: [
      "@fontsource/crimson-text/400.css",
      "@fontsource/crimson-text/400-italic.css",
      "@fontsource/crimson-text/600.css",
      "@fontsource/crimson-text/700.css",
    ],
    fallback: "Times, serif",
  },
};
