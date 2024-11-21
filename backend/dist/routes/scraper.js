"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cheerio_1 = __importDefault(require("cheerio")); // For HTML parsing
const router = express_1.default.Router();
// Scrape route
router.get('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    // Validate URL parameter
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required and should be a string' });
    }
    try {
        // Fetch the HTML content of the page
        const { data } = yield axios_1.default.get(url);
        // Log the data to check if the HTML content is fetched correctly
        if (!data) {
            return res.status(500).json({ error: 'Failed to retrieve HTML content from the URL' });
        }
        console.log('HTML content fetched successfully', data);
        const $ = cheerio_1.default.load(data);
        // Initialize the stats object
        const stats = {};
        // Scrape player stats
        $('div.mc-stats__stat-container').each((index, element) => {
            const label = $(element)
                .find('p.mc-stats__stat-label')
                .text()
                .trim();
            const playerAStat = $(element)
                .find('.mc-stats__stat-player-container--player-a .mc-stats__stat-player-number-primary')
                .text()
                .trim();
            const playerBStat = $(element)
                .find('.mc-stats__stat-player-container--player-b .mc-stats__stat-player-number-primary')
                .text()
                .trim();
            if (label) {
                // Add to stats object, making sure to handle empty or missing stats
                stats[label] = {
                    playerA: playerAStat || 'N/A', // Default to 'N/A' if player A stat is missing
                    playerB: playerBStat || 'N/A', // Default to 'N/A' if player B stat is missing
                };
            }
        });
        // Check if stats were found
        if (Object.keys(stats).length === 0) {
            return res.status(404).json({ error: 'No stats found for the provided URL' });
        }
        // Return the scraped stats
        res.json({ stats });
    }
    catch (error) {
        // Assert the error type to Error and access the message property
        const err = error;
        console.error('Error scraping the URL:', err.message);
        // Send a detailed error response
        res.status(500).json({ error: 'Failed to scrape data, please check the URL or try again later.' });
    }
}));
exports.default = router;
