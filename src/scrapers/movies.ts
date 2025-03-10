import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";

const url = "https://www.imdb.com/chart/top/";
const moviesData: Record<string, string> = {};

async function getHTML() {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
      },
    });

    if (!html) throw new Error("Empty HTML response");
    return html;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export async function scrapeMovies() {
  const html = await getHTML();
  if (!html) return;
  console.log("Fetched HTML successfully.");

  const $ = cheerio.load(html);

  $(".ipc-metadata-list-summary-item").each((_, movie) => {
    const title = $(movie).find("h3.ipc-title__text").text().trim();
    const rating = $(movie)
      .find("[data-testid='ratingGroup--imdb-rating'] .ipc-rating-star--rating")
      .text()
      .trim();

    if (title && rating) {
      moviesData[title] = rating;
    }
  });

  const filePath = path.resolve(__dirname, "../data/moviesData.json");

  fs.writeFileSync(filePath, JSON.stringify(moviesData, null, 2));
  console.log(`Movies Data saved to ${filePath}`);
}
