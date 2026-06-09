// Run: node scripts/upload-images.mjs
import { createClient } from "@sanity/client";
import https from "https";
import http from "http";

const client = createClient({
  projectId: "ucen4x5m",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "skoo8L82TOV9KFphgwEr00MEl8tln1gtT2KZ0MqGOaQv1oLKwSSGgoAbTTNNi693AiW4yc73sWJQitNNFFgvOdRQHcUM7SA2OOwXbUpMiny4QHI2ApM0RqniAoeKHcnPcfMxdVc39bgdCfxYPGfJqhnUGF32s4iIp6GbH8ZNktHv24ELaMLO",
  useCdn: false,
});

// Download a URL to a Buffer
function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    mod.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchBuffer(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      const chunks = [];
      res.on("data", (c) => chunks.push(c));
      res.on("end", () => resolve(Buffer.concat(chunks)));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Upload one image URL to Sanity, return asset reference
async function uploadImage(imageUrl, label) {
  const buf = await fetchBuffer(imageUrl);
  const filename = imageUrl.split("/").pop();
  const asset = await client.assets.upload("image", buf, { filename, contentType: "image/jpeg" });
  return { _type: "image", asset: { _type: "reference", _ref: asset._id } };
}

// ── Project image map: name → [mainImg, ...galleryImgs] ──────────────────────
const PROJECT_IMAGES = {
  "Residentie Zingaro": [
    "https://files.zabun.be/upload/3489/images/3acc78f2c452e6ab1dfbf7334fe461e3435468065178879a7c67b37c00118de2.jpg",
    "https://files.zabun.be/upload/3489/images/282045db30d8917c98107295495cf8a902fcb26176dbc101f17eb7980a149d85.jpg",
    "https://files.zabun.be/upload/3489/images/8a7f467753a21e7db7a6848791094fbbd15dff2b23be3686012c2d02f5887aad.jpg",
    "https://files.zabun.be/upload/3489/images/8069ce79a4cb348ccfd5ed4d07a28d9f83dc434266424bcdfd7c21647ca122a9.jpg",
  ],
  "Residentie Heritage": [
    "https://files.zabun.be/upload/3489/images/ea934139bf4f647fc640fb059a1c2453416cf61cdf88c0efa74e129f5e83ac2c.jpg",
    "https://files.zabun.be/upload/3489/images/5c0bed59e7f25e0ecfc2135017e3f7418d713aad3512bc35c09a58c7a18f41e7.jpg",
    "https://files.zabun.be/upload/3489/images/d98b0dc27389737d48033dd97b0bf522f0bbe144f904684b409fd0141fece5c9.jpg",
    "https://files.zabun.be/upload/3489/images/77d62da235cd70162fdf8d9b33a0f7cdd3129eb2af47cf71e782241d87e998b5.jpg",
  ],
  "Hof ter Linden": [
    "https://files.zabun.be/upload/3489/images/359a2ebb561a90b0455e5b2e88a3143fadd79922fa73e8235eb715ef07de2dd9.jpg",
    "https://files.zabun.be/upload/3489/images/3b2ce14056767aab110bf9360db4aadb010b771c56c9f4d7160a215e58f72de3.jpg",
    "https://files.zabun.be/upload/3489/images/28b9c0fc83cef4d2c11387939d1f0c524917a8e4cb5936845e1cb2268fbc9575.jpg",
  ],
  "Residentie Thonis": [
    "https://files.zabun.be/upload/3489/images/7f9c76e698137b02ea52a2b1f024087423f0fa129c54b1f9f4238ac3953987d1.jpg",
    "https://files.zabun.be/upload/3489/images/de17d9d0d035509b85294ac3df52e0ff505f05bbc34f55312df87eb003a9c69a.jpg",
    "https://files.zabun.be/upload/3489/images/ff023e63369b0d96d450610aeac6d20932df0283793c615c0f1e3c68b97a6da3.jpg",
    "https://files.zabun.be/upload/3489/images/49c02f6302edf0230a4c925edefd24bdafa6863ec4381a5a71ab457ae3c762fe.jpg",
  ],
  "Villa58": [
    "https://files.zabun.be/upload/3489/images/2c46a7e2d9c3985540b8f63c2e2e2a32f0e62184d95d7634b73e4a871bfcce26.jpg",
    "https://files.zabun.be/upload/3489/images/6007080b89c8bf03c4b3a7a003eeea22fffebf2a583041ba25bd7844abfc8541.jpg",
    "https://files.zabun.be/upload/3489/images/139ce0969fc5c31fe4d7e9b91324daf84801c0d6079bf2b96f62db4de769ea79.jpg",
  ],
  "Residentie Diesterhof – Woningen": [
    "https://files.zabun.be/upload/3489/images/ac1f34883e8d731941cf91862b73b4921a9f6f285f296e4ff6920622aae2e788.jpg",
    "https://files.zabun.be/upload/3489/images/139d5c87145d3c5ef74571d364d334498d0544fb73c57f81963068b4c2ccda9d.jpg",
    "https://files.zabun.be/upload/3489/images/59514593783dbdc7a5ed57f30030422ddf41e25a6aeccd41b482c6aade440f8e.jpg",
  ],
  "Residentie Diesterhof – Appartementen": [
    "https://files.zabun.be/upload/3489/images/285252afe9c11f21c577ef0c3db53effe2d01163000f2e874375a207338cdb92.jpg",
    "https://files.zabun.be/upload/3489/images/c702962a6da82a2ae9b28db7ffe779df888d3983445523373fda70ba0a325b40.jpg",
    "https://files.zabun.be/upload/3489/images/1a40f7a633ad5d38efd7dc2d6fe37510c95fb4b9361f1c8aa7bdfcef647710dd.jpg",
  ],
  "Residentie Molenhoek": [
    "https://files.zabun.be/upload/3489/images/ff552d88c52c47c7338173a051ea2ce731fa4d4b9a6ac2fbf0f32eb2fd94cc2f.jpg",
    "https://files.zabun.be/upload/3489/images/db2b09ac265ce44fa587677b23298970c87ffb4da7878978e890125e0c51d88c.jpg",
    "https://files.zabun.be/upload/3489/images/765dcb3c5aaf1244d640f86455c6880041ef42d6c04220270e8777f32c52b45f.jpg",
  ],
  "Residentie Quinta": [
    "https://files.zabun.be/upload/3489/images/61f60d64770484e0ac38006f1191ac7f94b930a524733a58233010d46968fff8.jpg",
    "https://files.zabun.be/upload/3489/images/4ebbb5919999f2dfaea690a8e5f2639ef8788e09e47ba13c40b90f638755fc0c.jpg",
    "https://files.zabun.be/upload/3489/images/787351a5ef1d65101d8f9ff941c91eca4bb70686cd5d90064859d431a4d374b1.jpg",
  ],
  "Residentie De Wissel": [
    "https://files.zabun.be/upload/3489/images/93e064afe0907e2819f64e02d043d8765054af95a2ee0b8863add9a823aca34c.jpg",
    "https://files.zabun.be/upload/3489/images/a8e687b1ac3fa6c5d8001fd667398727f4fb4d31adca0a08903374b6dfa578c4.jpg",
    "https://files.zabun.be/upload/3489/images/6cea461e3ba67737f1fef83651709c2edfbb0cae19b1225c90924c49ae067e10.jpg",
  ],
  "Halfopen Bebouwingen Diepenbeek": [
    "https://files.zabun.be/upload/3489/images/12355ae020cc6fa15b0e17a7ff6c653693d8920b97db8d98f64cfcbbcdc1115d.jpg",
    "https://files.zabun.be/upload/3489/images/3a22842fffe1e5d847aaf9dbd78390ff522d779a813e15244e3871419a8afb34.jpg",
    "https://files.zabun.be/upload/3489/images/bed5082688ff37a5bf9caeea41e402ad24c098abfd77418d90c2df1851f0c593.jpg",
  ],
  "Residentie Ferro": [
    "https://files.zabun.be/upload/3489/images/77e2444b8a4cde95a362c38b7ce15488bd57417378d66268e9a2d70460a729a5.jpg",
    "https://files.zabun.be/upload/3489/images/54c551e5d4fc02a0ddcb9a53d9f2d5ed7a5722547b8dcb6e9bb4b4c06ae0af11.jpg",
    "https://files.zabun.be/upload/3489/images/af972fc54d3ab9deb93fc7af4fbc1da571c16b4da8594dfeb1235500aaa33302.jpg",
  ],
  "Woonpark De Sleutel": [
    "https://files.zabun.be/upload/3489/images/8da5a57ba736699f390b7249ab5eeb61a401dfd7c2d82b92b8afce2181c4326c.jpg",
    "https://files.zabun.be/upload/3489/images/f7aa4c996a843360e97ca6ede4a5ebf37d74627a508184ef311e794e0939051c.jpg",
    "https://files.zabun.be/upload/3489/images/c1d252549d826f75fb43c65a406f11a2a48e73b96e387dcac68efefa122e4b7c.jpg",
  ],
  "Residentie Carbon": [
    "https://files.zabun.be/upload/3489/images/a4e630a24a757581789ae88b55603cae69350563ae24908e84f994ef7a62adeb.jpg",
    "https://files.zabun.be/upload/3489/images/a353000571c36b5672ee46fa5bde856822b3df5247282571c6f1fc99f9203991.jpg",
    "https://files.zabun.be/upload/3489/images/0aff4c5e1cf8f046d8286d071f9d184d468bfb7da46ece5320e8d505615829c9.jpg",
    "https://files.zabun.be/upload/3489/images/a940c2eaa52aa007a7ae9d13febf823055df5eeeeb5844169c05f0985ffed635.jpg",
  ],
  "Residentie Ambiorix": [
    "https://files.zabun.be/upload/3489/images/8dee81d750787592d4c7405729b7be60462a0975c37a4825035a108f8ba7737f.jpg",
    "https://files.zabun.be/upload/3489/images/596d7dd2e0c3e8acc6910796fb7388c2ae71d904a8997feeeb1abebc1606767e.jpg",
    "https://files.zabun.be/upload/3489/images/b5f1a481127dbef2e100a052e750a663701810d356ae42af077f12d6cdd64785.jpg",
    "https://files.zabun.be/upload/3489/images/16b19330028a5a60606e4e61553aee771683d93fa1277c1660c8de49853d3540.jpg",
  ],
  "Ter Has Business Hub": [
    "https://files.zabun.be/upload/3489/images/6d4ff8011e8d8d64af1aff30a40610b010c3507552da61e935ff6d3374fcd9b7.jpg",
    "https://files.zabun.be/upload/3489/images/6efb4b228489c9d614366cf9628ee0dfd8698a24c682e11ce4e024493b700d32.jpg",
    "https://files.zabun.be/upload/3489/images/123dc42712fc9f6ed34d02980f3207aaf5d23138f356d4b58bce6cd083e4a259.jpg",
  ],
  "Residentie Tuedo": [
    "https://files.zabun.be/upload/3489/images/9ede9c24c94daf2d4e40708c82b50af1b08043c237410649cc1e946d028f8cc4.jpg",
    "https://files.zabun.be/upload/3489/images/2fa4157c9cce14b376f1e9ea49c344e56636d14201b31c0b717d014c1b568c5f.jpg",
    "https://files.zabun.be/upload/3489/images/e79e4fff48bc0caee8b2d6551b8d282dd5b02bdfbc83e3244a777a9f12bcb328.jpg",
  ],
  "Appartementen Centrum Genk": [
    "https://files.zabun.be/upload/3489/images/fd2d3855e8435a823aa1dcb6122b5a00cd31d2f78f4c605eb702e1cd58a8880e.jpg",
    "https://files.zabun.be/upload/3489/images/802ddb66392ca60fa35570c8dc2c4314d9af04e543a72d189a5a02f1a3adfbe5.jpg",
    "https://files.zabun.be/upload/3489/images/a9776414c58b606d77a2ea2a9daa0f007b12bf47108959b70f7b76bec067569f.jpg",
  ],
  "Residentie Sacramento": [
    "https://files.zabun.be/upload/3489/images/d3798ea36fd3d3887fd6d56211501f3cea97cac25d8219436cb7cd670edc601e.jpg",
    "https://files.zabun.be/upload/3489/images/ca7daf13cf59681a7644652875e9b414e3e398c6f5efef9956d1ef8f8645e240.jpg",
    "https://files.zabun.be/upload/3489/images/15ead12c963f0c40f552f3662d60ee255637fa38d143e9c9430ceb7d2750873d.jpg",
    "https://files.zabun.be/upload/3489/images/13cbe55054df070475ed1d49f998ffb82b55fcf5a3bcbd5d64acc05c070fb191.jpg",
  ],
  "Residentie Coconn": [
    "https://files.zabun.be/upload/3489/images/54d702f9a98e3d26c20c40708da1338f8a2076bee5343ac57cf3b6c259cb05bb.jpg",
    "https://files.zabun.be/upload/3489/images/3ec72e5c9f49a40d211bc469af75b697581c31e83fcd96b7c18722a21f61be88.jpg",
    "https://files.zabun.be/upload/3489/images/58d8db583d87ea6f32b3b079926e9e3118b92db0c41f024e105298637d50515b.jpg",
    "https://files.zabun.be/upload/3489/images/503d9c7a91797e271710bc1b196f311e1418ef27ce9a375263e54a024beb0091.jpg",
  ],
  "Belgiek": [
    "https://files.zabun.be/upload/3489/images/6a4c172ccdad87cd016e001011ba46d9440ecfa628c48ea66cef98f56c88ab28.jpg",
    "https://files.zabun.be/upload/3489/images/13dcfd1b216581110cb3d9969c7fb468ca4bca63bd5f89b2baff2ad253a5e3c0.jpg",
    "https://files.zabun.be/upload/3489/images/3710668b1d122ec4ded9c5d1585699f38fe2a2ed20aee6ec1e3c23fcb465facb.jpg",
  ],
  "Residentie Bella Vista": [
    "https://files.zabun.be/upload/3489/images/6b0b2de7cbc958a653bd27cc266dc90e5b502fd08edc9bb07191ff6a42e2d637.jpg",
    "https://files.zabun.be/upload/3489/images/bb367b794cb2ed0e7332694224e6fe45a0301ae04b3c1853743f683c1775e5e3.jpg",
    "https://files.zabun.be/upload/3489/images/f6680328b8d195a82266d048291e0f949b801609ae7963e83c656bae8644e0bb.jpg",
    "https://files.zabun.be/upload/3489/images/a34921d25a4a86cf7bb81ff51834be9d081590a40bd5622814da2d69540adbf7.jpg",
  ],
};

// Apartment properties use the same images as their parent project
const PROPERTY_PROJECT_MAP = {
  "Residentie Coconn – 1 slpk appartement (0.04)": "Residentie Coconn",
  "Residentie Coconn – 2 slpk appartement (1.05)": "Residentie Coconn",
  "Residentie Coconn – Penthouse (4.01)": "Residentie Coconn",
  "Residentie Sacramento – 1 slpk appartement": "Residentie Sacramento",
  "Residentie Sacramento – 2 slpk appartement (gelijkvloers)": "Residentie Sacramento",
  "Residentie Sacramento – 2 slpk appartement met groot terras": "Residentie Sacramento",
  "Residentie Ambiorix – 2 slpk (gelijkvloers)": "Residentie Ambiorix",
  "Residentie Ambiorix – 2 slpk (1e verdieping)": "Residentie Ambiorix",
  "Residentie Ambiorix – 2 slpk (2e verdieping)": "Residentie Ambiorix",
  "Residentie Ferro – 1 slpk appartement": "Residentie Ferro",
  "Residentie Ferro – 2 slpk appartement": "Residentie Ferro",
  "Residentie Carbon – 2 slpk appartement": "Residentie Carbon",
  "Residentie Zingaro – 1 slpk appartement": "Residentie Zingaro",
  "Residentie Zingaro – 2 slpk appartement": "Residentie Zingaro",
  "Residentie Heritage – 2 slpk appartement": "Residentie Heritage",
  "Residentie Heritage – Penthouse": "Residentie Heritage",
  "Residentie Bella Vista – 2 slpk appartement": "Residentie Bella Vista",
};

async function processDoc(doc, imageUrls, docType) {
  const [mainUrl, ...galleryUrls] = imageUrls;
  process.stdout.write(`  📸 ${doc.name || doc.title} … `);

  try {
    const mainImage = await uploadImage(mainUrl, "main");
    const galleryImages = [];
    for (const url of galleryUrls.slice(0, 3)) {
      const img = await uploadImage(url, "gallery");
      galleryImages.push({ ...img, _key: Math.random().toString(36).slice(2) });
    }

    const patch = { image: mainImage };
    if (galleryImages.length) patch.gallery = galleryImages;

    await client.patch(doc._id).set(patch).commit();
    console.log(`✅`);
    return true;
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return false;
  }
}

async function main() {
  // ── 1. Projects ──────────────────────────────────────────────────────────────
  const projects = await client.fetch('*[_type == "project"]{_id, name, image}');
  console.log(`\n🏗️  Projecten (${projects.length}):`);
  let ok = 0, skip = 0, fail = 0;

  for (const p of projects) {
    if (p.image) { console.log(`  ⏭️  Al foto: ${p.name}`); skip++; continue; }
    const urls = PROJECT_IMAGES[p.name];
    if (!urls) { console.log(`  ⚠️  Geen URL gevonden: ${p.name}`); fail++; continue; }
    const success = await processDoc(p, urls, "project");
    success ? ok++ : fail++;
  }

  // ── 2. Apartment properties ───────────────────────────────────────────────
  const properties = await client.fetch('*[_type == "property" && type in ["Appartement","Penthouse"]]{_id, title, image}');
  console.log(`\n🏢  Appartementen (${properties.length}):`);

  for (const p of properties) {
    if (p.image) { console.log(`  ⏭️  Al foto: ${p.title}`); skip++; continue; }
    const projectName = PROPERTY_PROJECT_MAP[p.title];
    if (!projectName) { console.log(`  ⚠️  Geen mapping: ${p.title}`); fail++; continue; }
    const urls = PROJECT_IMAGES[projectName];
    if (!urls) { console.log(`  ⚠️  Geen URL voor project: ${projectName}`); fail++; continue; }
    const success = await processDoc(p, urls, "property");
    success ? ok++ : fail++;
  }

  console.log(`\n🎉 Klaar: ${ok} foto's geüpload, ${skip} overgeslagen, ${fail} mislukt.\n`);
}

main().catch(console.error);
