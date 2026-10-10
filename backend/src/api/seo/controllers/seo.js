'use strict';

const { getPlainText } = require('../../util');

const TILES = {
  audio: { uid: 'api::tile-audio.tile-audio', text: 'content' },
  image: { uid: 'api::tile-image.tile-image', text: 'description' },
  text: { uid: 'api::tile-text.tile-text', text: 'description' },
  video: { uid: 'api::tile-video.tile-video', text: 'description' },
};
const DESCRIPTION_LENGTH = 160;

// Same as the frontend's slugify (src/lib/utils.js), used for /t/<tag> URLs
const frontendSlugify = (text) =>
  String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');

const escapeHtml = (text) =>
  String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const shorten = (text, max = DESCRIPTION_LENGTH) => {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(' ', max - 1)) + '…';
};

// Rich text (blocks) or plain text field -> plain text
const plain = (value) => (Array.isArray(value) ? getPlainText(value) : String(value || ''));

// Strip a trailing slash, keep the scheme and host
const origin = (value) => String(value || '').replace(/\/+$/, '');

function origins(ctx) {
  return {
    site: origin(ctx.get('x-site-origin')),
    api: origin(ctx.get('x-api-origin')),
  };
}

async function getConfig(strapi) {
  return strapi.documents('api::config.config').findFirst({
    populate: { banner: true, logo: true },
  });
}

async function findTile(strapi, type, where) {
  const tile = TILES[type];
  if (!tile) return null;
  const found = await strapi.documents(tile.uid).findFirst({
    filters: where,
    status: 'published',
    populate: { tile: { populate: { image: true } } },
  });
  return found && { ...found, type };
}

// Page label for the non-tile pages (same labels as the menu)
async function pageTitle(strapi, config, path) {
  const [first, second] = path.split('/').filter(Boolean);
  switch (first) {
    case undefined:
    case 'time':
      return config?.label_date;
    case 'bio':
      return config?.label_bio;
    case 'contact':
      return config?.label_contact;
    case 'support':
      return config?.label_support;
    case 't': {
      if (!second) return config?.label_theme;
      const tags = await strapi.documents('api::tag.tag').findMany({ limit: 500 });
      return tags.find((tag) => frontendSlugify(tag.name) === second)?.name;
    }
    case 'm':
    case 'media': {
      if (!second) return config?.label_media;
      const labels = ['label_music', 'label_images', 'label_video', 'label_text'].map((k) => config?.[k]);
      return labels.find((label) => label && frontendSlugify(label) === second);
    }
    default:
      return null;
  }
}

module.exports = ({ strapi }) => ({
  async robots(ctx) {
    const { site } = origins(ctx);
    ctx.type = 'text/plain; charset=utf-8';
    const lines = ['User-agent: *', 'Allow: /'];
    if (site) lines.push(`Sitemap: ${site}/sitemap.xml`);
    ctx.body = lines.join('\n') + '\n';
  },

  async sitemap(ctx) {
    const { site } = origins(ctx);
    const config = await getConfig(strapi);
    const urls = [{ loc: '/time' }];
    if (config?.biography) urls.push({ loc: '/bio' });
    if (config?.contacts) urls.push({ loc: '/contact' });

    const tags = await strapi.documents('api::tag.tag').findMany({ sort: 'rank', limit: 500 });
    for (const tag of tags) urls.push({ loc: `/t/${frontendSlugify(tag.name)}` });

    for (const [type, { uid }] of Object.entries(TILES)) {
      const tiles = await strapi.documents(uid).findMany({
        status: 'published',
        fields: ['slug', 'updatedAt'],
        limit: 1000,
      });
      for (const tile of tiles) {
        if (tile.slug) {
          urls.push({ loc: `/time/${type}/${tile.slug}`, lastmod: tile.updatedAt });
        }
      }
    }

    ctx.type = 'application/xml; charset=utf-8';
    ctx.body =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
      urls
        .map(
          ({ loc, lastmod }) =>
            `  <url><loc>${escapeHtml(site + loc)}</loc>` +
            (lastmod ? `<lastmod>${new Date(lastmod).toISOString()}</lastmod>` : '') +
            '</url>'
        )
        .join('\n') +
      '\n</urlset>\n';
  },

  // <head> tags for a frontend path, included in index.html by nginx (SSI)
  async head(ctx) {
    const { site, api } = origins(ctx);
    const path = String(ctx.query.path || '/').split('?')[0];
    const config = await getConfig(strapi);
    const siteName = config?.title || '';

    // /time/audio/retour-a-la-mer, /t/concerts/image/x, /m/musique/audio/x
    // and old links like /time/audio_5
    let tile = null;
    const current = path.match(/\/(audio|image|text|video)\/([a-z0-9-]+)\/?$/);
    const legacy = path.match(/\/(audio|image|text|video)_(\d+)\/?$/);
    if (current) tile = await findTile(strapi, current[1], { slug: current[2] });
    else if (legacy) tile = await findTile(strapi, legacy[1], { legacy_id: Number(legacy[2]) });

    let title;
    let description = config?.subtitle || siteName;
    let image = config?.banner || config?.logo;
    let canonical = path.replace(/\/+$/, '') || '/time';
    let type = 'website';
    if (tile) {
      title = tile.tile?.title;
      description = shorten(plain(tile[TILES[tile.type].text])) || description;
      image = tile.tile?.image || image;
      // One URL per tile, whichever page (time, tag, media) it was opened from
      canonical = `/time/${tile.type}/${tile.slug}`;
      type = tile.type === 'audio' ? 'music.album' : 'article';
    } else {
      title = await pageTitle(strapi, config, path);
      // Tile URL whose tile doesn't exist (anymore)
      if (current || legacy) canonical = '/time';
    }

    const fullTitle = [title, siteName].filter(Boolean).join(' | ');
    const imageFormat = image?.formats?.large || image?.formats?.medium || image;
    const imageUrl = imageFormat?.url ? (imageFormat.url.startsWith('http') ? '' : api) + imageFormat.url : null;
    const url = site + canonical;

    const tags = [
      `<title>${escapeHtml(fullTitle)}</title>`,
      `<meta name="description" content="${escapeHtml(description)}">`,
      site && `<link rel="canonical" href="${escapeHtml(url)}">`,
      `<meta property="og:site_name" content="${escapeHtml(siteName)}">`,
      `<meta property="og:title" content="${escapeHtml(fullTitle)}">`,
      `<meta property="og:description" content="${escapeHtml(description)}">`,
      `<meta property="og:type" content="${type}">`,
      site && `<meta property="og:url" content="${escapeHtml(url)}">`,
      imageUrl && `<meta property="og:image" content="${escapeHtml(imageUrl)}">`,
      imageUrl && imageFormat.width && `<meta property="og:image:width" content="${imageFormat.width}">`,
      imageUrl && imageFormat.height && `<meta property="og:image:height" content="${imageFormat.height}">`,
      `<meta name="twitter:card" content="${imageUrl ? 'summary_large_image' : 'summary'}">`,
      `<meta name="twitter:title" content="${escapeHtml(fullTitle)}">`,
      `<meta name="twitter:description" content="${escapeHtml(description)}">`,
      imageUrl && `<meta name="twitter:image" content="${escapeHtml(imageUrl)}">`,
    ].filter(Boolean);

    ctx.type = 'text/html; charset=utf-8';
    ctx.body = tags.join('\n') + '\n';
  },
});
