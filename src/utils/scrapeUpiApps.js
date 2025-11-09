import fs from "fs";
import https from "https";

function fetchText(url, timeout = 15000) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          Accept: "text/html,application/xhtml+xml",
          "Accept-Language": "en-US,en;q=0.9",
        },
      },
      (res) => {
        if (res.statusCode !== 200) {
          res.resume();
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => resolve(data));
      }
    );
    req.on("error", reject);
    req.setTimeout(timeout, () => {
      req.destroy(new Error("Request timeout"));
    });
  });
}

async function fetchNpcNames() {
  const fallback = [
    "Google Pay",
    "PhonePe",
    "Paytm",
    "BHIM",
    "Amazon Pay",
    "WhatsApp",
    "Cred",
    "Mobikwik",
    "Freecharge",
    "Airtel Payments Bank",
    "Truecaller",
    "Ola Money",
    "Slice",
    "JioPay",
    "Bajaj Pay UPI",
  ];

  try {
    const html = await fetchText(
      "https://www.npci.org.in/what-we-do/upi/live-members"
    );
    const list = [...html.matchAll(/<li[^>]*>(.*?)<\/li>/g)]
      .map((m) => m[1].replace(/<[^>]+>/g, "").trim())
      .filter(Boolean);

    const unique = [...new Set(list)];
    return unique.length ? unique.slice(0, 20) : fallback;
  } catch (error) {
    return fallback;
  }
}

async function searchPlay(appName) {
  try {
    const searchUrl = `https://play.google.com/store/search?q=${encodeURIComponent(
      appName
    )}&c=apps&hl=en`;

    const html = await fetchText(searchUrl);

    const pkgMatch = html.match(/\/store\/apps\/details\?id=([^"&]+)/);
    if (!pkgMatch) return null;

    const packageName = pkgMatch[1];

    const iconMatch = html.match(
      /https:\/\/play-lh\.googleusercontent\.com\/[a-zA-Z0-9_-]+=[a-z0-9]+/
    );
    const icon = iconMatch ? iconMatch[0] : "";

    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
    const intentUrl = `intent://${packageName}/#Intent;scheme=package;end`;

    return {
      packageName,
      name: appName,
      icon,
      playStoreUrl,
      intentUrl,
    };
  } catch (error) {
    return null;
  }
}

async function asyncPool(limit, items, task) {
  const results = [];
  const executing = [];

  for (const item of items) {
    const p = Promise.resolve()
      .then(() => task(item))
      .catch(() => null);

    results.push(p);

    if (limit <= items.length) {
      const e = p.finally(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= limit) await Promise.race(executing);
    }
  }

  return Promise.all(results);
}

export async function buildUpiApps() {
  const names = await fetchNpcNames();
  const infos = await asyncPool(3, names, searchPlay);
  const out = names.map((name, i) => infos[i]).filter(Boolean);

  fs.mkdirSync("src/utils", { recursive: true });
  fs.writeFileSync(
    "src/utils/upi-apps.json",
    JSON.stringify(out, null, 2),
    "utf8"
  );
}

if (process.argv[1].endsWith("scrapeUpiApps.js")) {
  buildUpiApps().catch(() => process.exit(1));
}
