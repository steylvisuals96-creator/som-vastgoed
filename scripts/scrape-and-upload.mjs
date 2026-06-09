/**
 * scrape-and-upload.mjs
 *
 * Voor elke property in de mapping:
 *  1. Scrape de oude somvastgoed.be pagina → adres, beschrijving, specificaties, fotos
 *  2. Geocodeer het adres via OpenStreetMap Nominatim
 *  3. Upload max 10 fotos naar Sanity assets
 *  4. Patch het Sanity document met:
 *     - image (hoofdfoto), gallery (array), fullAddress, lat, lng
 *     - description (als leeg), beds (als leeg), area (als leeg)
 *
 * Run: node scripts/scrape-and-upload.mjs
 */

import https from "https";
import http from "http";

const SANITY_PROJECT_ID = "ucen4x5m";
const SANITY_DATASET = "production";
const SANITY_TOKEN =
  "skoo8L82TOV9KFphgwEr00MEl8tln1gtT2KZ0MqGOaQv1oLKwSSGgoAbTTNNi693AiW4yc73sWJQitNNFFgvOdRQHcUM7SA2OOwXbUpMiny4QHI2ApM0RqniAoeKHcnPcfMxdVc39bgdCfxYPGfJqhnUGF32s4iIp6GbH8ZNktHv24ELaMLO";
const SANITY_API = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-06-07`;

// ── Mapping: Sanity _id → oud website pad ──────────────────────────────────
const PROPERTIES = [
  { id: "fOUlc2fW6Fmz90IZ470wwd", path: "/nl/aanbod/4388841/" },
  { id: "nezkhiV91xA2vweOlmfem2", path: "/nl/aanbod/4384621/" },
  { id: "VC3WY1nVpnAvvqpbnQICDg", path: "/nl/aanbod/4383078/" },
  { id: "fOUlc2fW6Fmz90IZ470yVu", path: "/nl/aanbod/4382287/" },
  { id: "nezkhiV91xA2vweOlmfgOd", path: "/nl/aanbod/4360552/" },
  { id: "VC3WY1nVpnAvvqpbnQIHlg", path: "/nl/aanbod/4352373/" },
  { id: "nezkhiV91xA2vweOlmfk0B", path: "/nl/aanbod/4350283/" },
  { id: "VC3WY1nVpnAvvqpbnQIItg", path: "/nl/aanbod/4302173/" },
  { id: "fOUlc2fW6Fmz90IZ471Jng", path: "/nl/aanbod/4305658/" },
  { id: "VC3WY1nVpnAvvqpbnQISdg", path: "/nl/aanbod/4331441/" },
  { id: "fOUlc2fW6Fmz90IZ471Qxz", path: "/nl/aanbod/4290742/" },
  { id: "fOUlc2fW6Fmz90IZ471RYn", path: "/nl/aanbod/4177668/" },
  { id: "VC3WY1nVpnAvvqpbnQIUfg", path: "/nl/aanbod/4366847/" },
  { id: "VC3WY1nVpnAvvqpbnQIYNg", path: "/nl/aanbod/4352466/" },
  { id: "nezkhiV91xA2vweOlmfvMM", path: "/nl/aanbod/4364744/" },
  { id: "fOUlc2fW6Fmz90IZ471b14", path: "/nl/aanbod/4354402/" },
  { id: "VC3WY1nVpnAvvqpbnQIa5g", path: "/nl/aanbod/4352702/" },
  { id: "VC3WY1nVpnAvvqpbnQIb7g", path: "/nl/aanbod/4343584/" },
  { id: "nezkhiV91xA2vweOlmfyrW", path: "/nl/aanbod/4336503/" },
  { id: "nezkhiV91xA2vweOlmg0aV", path: "/nl/aanbod/4335053/" },
  { id: "nezkhiV91xA2vweOlmg0lg", path: "/nl/aanbod/4303767/" },
  { id: "fOUlc2fW6Fmz90IZ471h7e", path: "/nl/aanbod/4301093/" },
  { id: "fOUlc2fW6Fmz90IZ471jKM", path: "/nl/aanbod/4295807/" },
  { id: "fOUlc2fW6Fmz90IZ471lJv", path: "/nl/aanbod/4293651/" },
  { id: "nezkhiV91xA2vweOlmg5tR", path: "/nl/aanbod/4290802/" },
  { id: "VC3WY1nVpnAvvqpbnQIgJg", path: "/nl/aanbod/4268971/" },
  { id: "VC3WY1nVpnAvvqpbnQIh5g", path: "/nl/aanbod/4258419/" },
  { id: "VC3WY1nVpnAvvqpbnQIhbg", path: "/nl/aanbod/4225642/" },
  { id: "fOUlc2fW6Fmz90IZ471u8l", path: "/nl/aanbod/4158200/" },
];

// ── HTTP helpers ───────────────────────────────────────────────────────────

function fetchText(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    const req = lib.get(url, { headers: { "User-Agent": "Mozilla/5.0 (SOM-scraper/1.0)" }, ...opts }, (res) => {
      // Follow redirects
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const next = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchText(next, opts).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
    });
    req.on("error", reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib.get(url, { headers: { "User-Agent": "Mozilla/5.0 (SOM-scraper/1.0)" } }, (res) => {
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && res.headers.location) {
        const next = res.headers.location.startsWith("http")
          ? res.headers.location
          : new URL(res.headers.location, url).href;
        return fetchBuffer(next).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve({ buffer: Buffer.concat(chunks), contentType: res.headers["content-type"] || "image/jpeg" }));
    }).on("error", reject);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Scraping helpers ───────────────────────────────────────────────────────

function extractImages(html) {
  const urls = new Set();
  // data-src and src on img tags pointing to files.zabun.be
  const re = /(?:data-src|src)=["']([^"']*files\.zabun\.be\/upload\/[^"']+\.(?:jpg|jpeg|png|webp)[^"']*)["']/gi;
  let m;
  while ((m = re.exec(html)) !== null) {
    const url = m[1].split("?")[0]; // strip query params
    if (!url.includes("/thumbnail/") && !url.includes("/small/") && !url.includes("/thumb/")) {
      urls.add(url);
    }
  }
  return [...urls];
}

function extractAddress(html) {
  // Strategy 1: og:url slug contains postal + city e.g. "in-3500-hasselt"
  // URL format: /woning-te-koop-in-3500-hasselt or /woning-te-koop-in-3500-sint-truiden
  let postalCity = null;
  const ogUrl = html.match(/og:url[^>]*content=["'][^"']*-in-(\d{4})-([a-z][a-z0-9\-]+)["']/i);
  if (ogUrl) {
    postalCity = `${ogUrl[1]} ${capitalise(ogUrl[2].replace(/-/g, " "))}`;
  }

  // Strategy 2: meta description has "straatnaam NR te gemeente"
  const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{20,600})["']/i);
  if (metaDesc) {
    const desc = metaDesc[1];
    // "Acaciastraat 85 te Hasselt" or "aan de X 12 te Y"
    const streetMatch = desc.match(/\b([A-Z][a-zéèêëàâùûüîïôçœæ\-]+(?:straat|laan|dreef|steenweg|weg|dijk|plein|berg|baan|lei|kouter|veld|park|linde|beuk|eik|kers|wilg)[a-z]*\s+\d+[a-zA-Z\/\-]*)\s+te\s/i);
    if (streetMatch) {
      const street = streetMatch[1];
      return postalCity ? `${street}, ${postalCity}` : street;
    }
  }

  // Strategy 3: raw HTML Belgian address with postal
  const rawMatch = html.match(/([A-Z][a-zéèêëàâùûüîïôçœæ\-]+(?:straat|laan|dreef|steenweg|weg|dijk|plein|berg|baan|lei)\s+\d+[a-zA-Z\/\-]*)[,\s]+(\d{4}\s+[A-Z][a-zéèêëàâùûüîïôçœæ\-]+)/);
  if (rawMatch) return `${rawMatch[1]}, ${rawMatch[2]}`;

  // Strategy 4: just the postal+city from og:url
  return postalCity;
}

function capitalise(s) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

function extractDescription(html) {
  // 1. <div itemprop="description"> or <section itemprop="description">
  let m = html.match(/itemprop=["']description["'][^>]*>([\s\S]{50,5000}?)<\/(?:div|section|article)/i);
  if (m) { const t = cleanText(stripTags(m[1])); if (t.length > 50) return t.slice(0, 3000); }

  // 2. Common description div classes
  const descClasses = ["description", "omschrijving", "property-description", "listing-description", "detail-description", "text-content", "content-text", "property__description", "detail__description"];
  for (const cls of descClasses) {
    m = html.match(new RegExp(`class=["'][^"']*${cls}[^"']*["'][^>]*>([\\s\\S]{80,5000}?)<\\/(?:div|section)`, "i"));
    if (m) {
      const text = cleanText(stripTags(m[1]));
      if (text.length > 80) return text.slice(0, 3000);
    }
  }

  // 3. meta description as fallback (already has nice plain text)
  m = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']{80,})["']/i);
  if (m) return cleanText(m[1]).slice(0, 3000);

  return null;
}

function extractSpecs(html) {
  const specs = {};

  // Beds: look for slaapkamer(s) preceded by a number
  let m = html.match(/(\d+)\s*slaapkamer/i);
  if (m) specs.beds = parseInt(m[1]);

  // Area: bewoonbare oppervlakte, woonoppervlakte, living area
  m = html.match(/(\d+(?:[.,]\d+)?)\s*m[²2]/i);
  if (m) specs.area = parseFloat(m[1].replace(",", "."));

  // Try to also find: "Bewoonbare opp.: 185 m²"
  m = html.match(/(?:bewoonbare|woon|living)\s*(?:oppervlakte|opp\.?|area)[^:]*:\s*(\d+(?:[.,]\d+)?)/i);
  if (m) specs.area = parseFloat(m[1].replace(",", "."));

  return specs;
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
}

function cleanText(s) {
  return s.replace(/\s+/g, " ").trim();
}

// ── Geocoding ──────────────────────────────────────────────────────────────

async function geocode(address) {
  if (!address) return null;
  try {
    const encoded = encodeURIComponent(address + ", Belgium");
    const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1&countrycodes=be`;
    const text = await fetchText(url, { headers: { "User-Agent": "SOM-Vastgoed-scraper/1.0 (info@somvastgoed.be)" } });
    const results = JSON.parse(text);
    if (results.length > 0) {
      return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
    }
  } catch (e) {
    console.error("  Geocode error:", e.message);
  }
  return null;
}

// ── Sanity helpers ─────────────────────────────────────────────────────────

async function uploadImageToSanity(imageUrl) {
  const { buffer, contentType } = await fetchBuffer(imageUrl);
  const ext = imageUrl.split(".").pop().split("?")[0].toLowerCase() || "jpg";
  const filename = imageUrl.split("/").pop().split("?")[0] || `image.${ext}`;

  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${SANITY_PROJECT_ID}.api.sanity.io`,
      path: `/v2021-06-07/assets/images/${SANITY_DATASET}?filename=${encodeURIComponent(filename)}`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${SANITY_TOKEN}`,
        "Content-Type": contentType,
        "Content-Length": buffer.length,
      },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          if (data.document?._id) resolve(data.document._id);
          else reject(new Error(`Upload failed: ${JSON.stringify(data)}`));
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(buffer);
    req.end();
  });
}

async function patchProperty(id, patch) {
  const body = JSON.stringify({
    mutations: [{ patch: { id, set: patch } }],
  });
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${SANITY_PROJECT_ID}.api.sanity.io`,
      path: `/v2021-06-07/data/mutate/${SANITY_DATASET}?returnDocuments=false`,
      method: "POST",
      headers: {
        Authorization: `Bearer ${SANITY_TOKEN}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString());
          if (data.results || data.transactionId) resolve(data);
          else reject(new Error(`Patch failed: ${JSON.stringify(data)}`));
        } catch (e) { reject(e); }
      });
    });
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── Main ───────────────────────────────────────────────────────────────────

async function processProperty(prop, index) {
  const { id, path } = prop;
  const url = `https://www.somvastgoed.be${path}`;
  console.log(`\n[${index + 1}/${PROPERTIES.length}] ${id}`);
  console.log(`  URL: ${url}`);

  // 1. Fetch old page
  let html;
  try {
    html = await fetchText(url);
  } catch (e) {
    console.error("  ✗ Fetch failed:", e.message);
    return;
  }

  // 2. Extract data
  const imageUrls = extractImages(html);
  const address = extractAddress(html);
  const description = extractDescription(html);
  const specs = extractSpecs(html);

  console.log(`  → ${imageUrls.length} fotos gevonden`);
  console.log(`  → Adres: ${address ?? "(niet gevonden)"}`);
  console.log(`  → Beschrijving: ${description ? description.slice(0, 80) + "…" : "(niet gevonden)"}`);
  console.log(`  → Specs: beds=${specs.beds ?? "-"}, area=${specs.area ?? "-"}`);

  // 3. Geocode
  let coords = null;
  if (address) {
    await sleep(1100); // Nominatim rate limit: max 1 req/sec
    coords = await geocode(address);
    console.log(`  → Coords: ${coords ? `${coords.lat}, ${coords.lng}` : "(niet gevonden)"}`);
  }

  // 4. Upload photos (max 10)
  const toUpload = imageUrls.slice(0, 10);
  const uploadedAssetIds = [];
  for (let i = 0; i < toUpload.length; i++) {
    const imgUrl = toUpload[i];
    try {
      const assetId = await uploadImageToSanity(imgUrl);
      uploadedAssetIds.push(assetId);
      process.stdout.write(`  ✓ foto ${i + 1}/${toUpload.length} `);
      await sleep(200); // small pause between uploads
    } catch (e) {
      process.stdout.write(`  ✗ foto ${i + 1} FOUT: ${e.message.slice(0, 60)} `);
    }
  }
  console.log();

  // 5. Build patch
  const patch = {};

  if (uploadedAssetIds.length > 0) {
    patch.image = {
      _type: "image",
      asset: { _type: "reference", _ref: uploadedAssetIds[0] },
    };
    patch.gallery = uploadedAssetIds.slice(1).map((assetId, i) => ({
      _type: "image",
      _key: `img_${i}_${assetId.slice(-6)}`,
      asset: { _type: "reference", _ref: assetId },
    }));
  }

  if (address) patch.fullAddress = address;
  if (coords) { patch.lat = coords.lat; patch.lng = coords.lng; }
  if (description) patch.description = description;
  if (specs.beds) patch.beds = specs.beds;
  if (specs.area) patch.area = specs.area;

  if (Object.keys(patch).length === 0) {
    console.log("  → Niets te patchen");
    return;
  }

  // 6. Patch Sanity
  try {
    await patchProperty(id, patch);
    console.log(`  ✓ Sanity document gepatcht (${Object.keys(patch).join(", ")})`);
  } catch (e) {
    console.error("  ✗ Patch fout:", e.message);
  }
}

async function main() {
  console.log("═══════════════════════════════════════════════════════");
  console.log("  SOM Vastgoed — scrape + upload script");
  console.log(`  ${PROPERTIES.length} properties te verwerken`);
  console.log("═══════════════════════════════════════════════════════");

  for (let i = 0; i < PROPERTIES.length; i++) {
    await processProperty(PROPERTIES[i], i);
    // Pause between properties to be polite to the old server
    if (i < PROPERTIES.length - 1) await sleep(800);
  }

  console.log("\n═══════════════════════════════════════════════════════");
  console.log("  Klaar!");
  console.log("═══════════════════════════════════════════════════════");
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
