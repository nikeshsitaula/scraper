import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const url = "https://www.livescore.com/en/";

export async function scrapeLiveScores() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "domcontentloaded" });

  await page.waitForSelector(".Yh [data-test-id='virtuoso-item-list'] > div");

  const liveScoreData = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll(".Yh [data-test-id='virtuoso-item-list'] > div")
    ).map((game, index) => ({
      index: index + 1,
      title:
        game.querySelector("#category-header__stage")?.textContent?.trim() ||
        "N/A",
      homeTeam:
        game.querySelector("[id*='home-team-name']")?.textContent?.trim() ||
        "N/A",
      awayTeam:
        game.querySelector("[id*='away-team-name']")?.textContent?.trim() ||
        "N/A",
      homeScore:
        game.querySelector("[id*='home-team-score']")?.textContent?.trim() ||
        "N/A",
      awayScore:
        game.querySelector("[id*='away-team-score']")?.textContent?.trim() ||
        "N/A",
    }));
  });

  await browser.close();

  const filePath = path.resolve(__dirname, "../data/liveScoreData.json");

  fs.writeFileSync(filePath, JSON.stringify(liveScoreData, null, 2));
  console.log(`Live Score Data saved to ${filePath}`);
}
