'use strict';

// Readable, stable URLs for tiles: /time/audio/retour-a-la-mer
//
// - `slug` is generated from the tile title when a tile is created without
//   one, then never changed automatically. It stays editable in the admin:
//   whatever is typed is normalized ("Été 2024!" -> "ete-2024") and made
//   unique; clearing it generates a new one from the title.
// - It is a plain string field rather than a `uid`: Strapi's v4 -> v5
//   migration 5.0.0-05-drop-slug-fields-index fails on Postgres for uid
//   fields that did not exist in v4 (a failed DROP aborts its transaction).
// - `legacy_id` keeps the Strapi 4 id so old links (/time/audio_5) can be
//   redirected (Strapi 5 changes an entry's id on every publish). It is set
//   by database/migrations/2026.10.10T00.00.00.tile-slug-and-legacy-id.js.

const TILE_UIDS = [
  'api::tile-audio.tile-audio',
  'api::tile-image.tile-image',
  'api::tile-text.tile-text',
  'api::tile-video.tile-video',
];
const MAX_LENGTH = 60;

function slugify(text) {
  const slug = String(text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // accents
    .replace(/œ/gi, 'oe')
    .replace(/æ/gi, 'ae')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  if (slug.length <= MAX_LENGTH) return slug;
  // Cut at the last word boundary that fits
  const cut = slug.slice(0, MAX_LENGTH + 1);
  return cut.slice(0, cut.lastIndexOf('-') > 0 ? cut.lastIndexOf('-') : MAX_LENGTH);
}

// Slug from `text`, made unique among the other documents of `uid`
async function uniqueSlug(strapi, uid, text, documentId, fallback) {
  const base = slugify(text) || slugify(fallback);
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? base : `${base}-${n}`;
    const taken = await strapi.db.query(uid).findOne({
      where: { slug: candidate, ...(documentId && { documentId: { $ne: documentId } }) },
      select: ['id'],
    });
    if (!taken) return candidate;
  }
}

// Document service middleware: normalize the slug on create/update, or
// generate it from the tile title when missing
async function ensureSlug(strapi, { uid, action, params }) {
  const data = params?.data;
  if (!TILE_UIDS.includes(uid) || !data || !['create', 'update'].includes(action)) return;
  if (action === 'update' && !('slug' in data)) return; // partial update, keep it
  const type = uid.split('.').pop().replace('tile-', '');
  let source = data.slug || data.tile?.title;
  if (!source && params.documentId) {
    // Slug cleared in an update that doesn't include the title
    const current = await strapi.db.query(uid).findOne({
      where: { documentId: params.documentId },
      populate: { tile: { select: ['title'] } },
    });
    source = current?.tile?.title;
  }
  data.slug = await uniqueSlug(strapi, uid, source, params.documentId, `${type}-${Date.now()}`);
}

// Bootstrap: give tiles without a slug one (existing tiles after the
// migration). Writes through the query layer so draft and published rows get
// the same value without republishing.
async function backfill(strapi) {
  for (const uid of TILE_UIDS) {
    const rows = await strapi.db.query(uid).findMany({
      select: ['id', 'documentId', 'slug', 'publishedAt'],
      populate: { tile: { select: ['title'] } },
      orderBy: { id: 'asc' },
    });
    const documents = new Map();
    for (const row of rows) {
      if (!documents.has(row.documentId)) documents.set(row.documentId, []);
      documents.get(row.documentId).push(row);
    }

    for (const [documentId, docRows] of documents) {
      if (docRows.some((r) => r.slug)) continue;
      const main = docRows.find((r) => r.publishedAt) || docRows[0];
      const type = uid.split('.').pop().replace('tile-', '');
      const slug = await uniqueSlug(strapi, uid, main.tile?.title, documentId, `${type}-${main.id}`);
      await strapi.db.query(uid).updateMany({ where: { documentId }, data: { slug } });
    }
  }
}

module.exports = { TILE_UIDS, slugify, ensureSlug, backfill };
