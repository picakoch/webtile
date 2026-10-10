// Page <head> tags, kept in sync with what the server includes in index.html
// (backend/src/api/seo): "Page | Site" title, description, canonical URL and
// Open Graph tags.

const DESCRIPTION_LENGTH = 160;

// Plain text of a Strapi "blocks" (rich text) value, or of a plain string
export function plainText(value) {
  if (!Array.isArray(value)) {
    return String(value || "");
  }
  return value
    .map((node) =>
      node.type === "text" ? node.text : plainText(node.children),
    )
    .join(value.some((node) => node.type !== "text") ? " " : "")
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(text) {
  const clean = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= DESCRIPTION_LENGTH) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", DESCRIPTION_LENGTH - 1)) + "…";
}

function setTag(selector, create, attribute, value) {
  let el = document.head.querySelector(selector);
  if (!value) {
    el?.remove();
    return;
  }
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attribute, value);
}

function setMeta(key, value, attr = "name") {
  setTag(
    `meta[${attr}="${key}"]`,
    () => {
      const el = document.createElement("meta");
      el.setAttribute(attr, key);
      return el;
    },
    "content",
    value,
  );
}

export default {
  methods: {
    // title: page or tile title; description: plain text or blocks;
    // canonical: path ("/time/audio/x"), defaults to the current path;
    // image: absolute URL
    updateMetaTags(title, description, { canonical, image } = {}) {
      const site = this.$store.getters.config?.title;
      const fullTitle = [title, site].filter(Boolean).join(" | ");
      const text =
        shorten(plainText(description)) ||
        this.$store.getters.config?.subtitle ||
        site;
      const url =
        window.location.origin +
        (canonical || this.$route.path.replace(/\/+$/, ""));

      document.title = fullTitle;
      setMeta("description", text);
      setTag(
        'link[rel="canonical"]',
        () => {
          const el = document.createElement("link");
          el.setAttribute("rel", "canonical");
          return el;
        },
        "href",
        url,
      );
      setMeta("og:title", fullTitle, "property");
      setMeta("og:description", text, "property");
      setMeta("og:url", url, "property");
      // Pages without their own image use the site banner (or logo)
      const config = this.$store.getters.config;
      const fallback = (config?.banner || config?.logo)?.url;
      const pageImage =
        image || (fallback && this.$store.getters.backend_url + fallback);
      setMeta("og:image", pageImage, "property");
      setMeta("twitter:image", pageImage);
      setMeta("twitter:title", fullTitle);
      setMeta("twitter:description", text);
    },
    // Tile pages: one canonical URL per tile, whichever page opened it
    updateTileMetaTags(type, tile, description) {
      if (!tile) return;
      const image = tile.tile?.image;
      const format = image?.formats?.large || image?.formats?.medium || image;
      this.updateMetaTags(tile.tile?.title, description, {
        canonical: `/time/${type}/${tile.slug}`,
        image: format?.url && this.$store.getters.backend_url + format.url,
      });
    },
  },
};
