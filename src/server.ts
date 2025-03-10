import express from "express";
import { SCRAPER_TYPE } from "../config";
import { scrapeLiveScores } from "./scrapers/liveScores";
import { scrapeMovies } from "./scrapers/movies";

const app = express();
const port = 3000;

app.use(express.json());

async function startScraper() {
  if (SCRAPER_TYPE === "live-scores") {
    console.log("Running Live Scores Scraper...");
    await scrapeLiveScores();
  } else if (SCRAPER_TYPE === "movies") {
    console.log("Running Movies Scraper...");
    await scrapeMovies();
  } else {
    console.error("Invalid SCRAPER_TYPE. Use 'live-scores' or 'movies'.");
  }
}

startScraper();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
