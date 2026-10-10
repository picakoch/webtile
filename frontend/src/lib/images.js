// Responsive images from Strapi uploads: Strapi stores resized copies of
// each image (formats: small 500 px, medium 750 px, large 1000 px wide);
// `srcset` lets the browser download only the one that fits the screen.
//
// Measured on picasol's images:
// - high-density phones pick the widest copy offered, so small tiles are
//   capped at the 750 px copy (what every tile used before)
// - Strapi's resized PNGs can be heavier than the original (a 500 px copy of
//   222 KB for a 146 KB original): a copy heavier than the original is
//   replaced by the original

// Widest original offered for wide images (no multi-megabyte downloads)
const MAX_ORIGINAL_WIDTH = 2000;

// Candidate files for an image: [{ url, width }]
// wide: double-width tiles and album covers (copies up to 1000 px, and the
// original up to MAX_ORIGINAL_WIDTH)
function candidates(image, wide) {
  if (!image?.url) return [];
  const maxWidth = wide ? Infinity : 750;
  const original = image.width ? image : null;
  // Strapi stores sizes in KB, for the original and each copy
  const heavierThanOriginal = (format) =>
    original?.size && format.size && format.size > original.size;

  const formats = ["small", "medium", "large"]
    .map((name) => image.formats?.[name])
    .filter(
      (format) => format?.url && format.width && format.width <= maxWidth,
    );
  const kept = formats.filter((format) => !heavierThanOriginal(format));

  const useOriginal =
    original &&
    (kept.length < formats.length || // a copy was heavier: original instead
      kept.length === 0 ||
      (wide && original.width <= MAX_ORIGINAL_WIDTH));
  if (useOriginal) kept.push(original);

  return kept
    .sort((a, b) => a.width - b.width)
    .filter((format, i, all) => i === 0 || format.width !== all[i - 1].width);
}

// srcset attribute: "<url> 500w, <url> 750w, ..." (base: the API's URL)
export function imageSrcset(image, base, { wide = false } = {}) {
  return candidates(image, wide)
    .map((format) => `${base}${format.url} ${format.width}w`)
    .join(", ");
}

// Fallback src (browsers without srcset): the widest candidate
export function imageSrc(image, base, { wide = false } = {}) {
  const all = candidates(image, wide);
  const format = all[all.length - 1] || image;
  return format?.url ? base + format.url : "";
}
