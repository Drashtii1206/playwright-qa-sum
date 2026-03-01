const { chromium } = require("playwright");

const URLS = [
  "https://sanand0.github.io/tdsdata/js_table/?seed=79",
  "https://sanand0.github.io/tdsdata/js_table/?seed=80",
  "https://sanand0.github.io/tdsdata/js_table/?seed=81",
  "https://sanand0.github.io/tdsdata/js_table/?seed=82",
  "https://sanand0.github.io/tdsdata/js_table/?seed=83",
  "https://sanand0.github.io/tdsdata/js_table/?seed=84",
  "https://sanand0.github.io/tdsdata/js_table/?seed=85",
  "https://sanand0.github.io/tdsdata/js_table/?seed=86",
  "https://sanand0.github.io/tdsdata/js_table/?seed=87",
  "https://sanand0.github.io/tdsdata/js_table/?seed=88",
];

function extractNumbers(text) {
  // supports: 123, -45, 1,234, 56.78
  const matches = text.match(/-?\d[\d,]*(?:\.\d+)?/g);
  if (!matches) return [];
  return matches
    .map(s => Number(s.replace(/,/g, "")))
    .filter(n => Number.isFinite(n));
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  let grandTotal = 0;

  for (const url of URLS) {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForSelector("table", { timeout: 30000 });

    // Only sum numbers INSIDE tables
    const tableText = await page.$$eval("table", tables =>
      tables.map(t => t.innerText).join("\n")
    );

    const nums = extractNumbers(tableText);
    const sum = nums.reduce((a, b) => a + b, 0);

    console.log(`PAGE_SUM ${url} = ${sum}`);
    grandTotal += sum;
  }

  console.log(`FINAL_TOTAL=${grandTotal}`);
  await browser.close();
})();