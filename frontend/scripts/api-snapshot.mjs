// Run every GraphQL query the frontend uses against an API and save the
// responses, to compare two backends (e.g. production vs a restored copy):
//
//   node frontend/scripts/api-snapshot.mjs https://api.picasol.fr /tmp/prod
//   node frontend/scripts/api-snapshot.mjs http://localhost:1938 /tmp/local
//   diff -r /tmp/prod /tmp/local
//
// Uses src/lib/queries.js, so it sends exactly what the site sends.
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { print } from "graphql";
import * as Q from "../src/lib/queries.js";

const [api, out] = process.argv.slice(2);
if (!api || !out) {
  console.error("Usage: node frontend/scripts/api-snapshot.mjs API_URL OUT_DIR");
  process.exit(1);
}
mkdirSync(out, { recursive: true });

async function run(name, query, variables = {}) {
  const res = await fetch(`${api}/graphql`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query: print(query), variables }),
  });
  const json = await res.json();
  writeFileSync(join(out, `${name}.json`), JSON.stringify(json, null, 2) + "\n");
  if (json.errors) console.error(`!! ${name}: ${json.errors[0].message}`);
  return json;
}

await run("config", Q.CONFIG_Q);
await run("tags", Q.TAGS_Q);

const kinds = [
  ["image", Q.IMAGES_Q, Q.IMAGE_Q, "tileImages"],
  ["video", Q.VIDEOS_Q, Q.VIDEO_Q, "tileVideos"],
  ["audio", Q.AUDIOS_Q, Q.AUDIO_Q, "tileAudios"],
  ["text", Q.TEXTS_Q, Q.TEXT_Q, "tileTexts"],
];
let count = 0;
for (const [kind, listQuery, itemQuery, key] of kinds) {
  const list = await run(`${kind}s`, listQuery);
  for (const { id } of list.data?.[key]?.data || []) {
    await run(`${kind}_${id}`, itemQuery, { id });
    count++;
  }
}

for (const term of ["picasol", "concert", "jazz", "live"]) {
  await run(`search_${term}`, Q.SEARCH_Q, { query: term });
}

console.log(`${api}: ${count} tiles, saved to ${out}`);
