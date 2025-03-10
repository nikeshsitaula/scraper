import dotenv from "dotenv";

dotenv.config();

export const SCRAPER_TYPE = process.env.SCRAPER_TYPE || "movies";
