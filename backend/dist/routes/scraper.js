"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const cheerio = __importStar(require("cheerio")); // Ensure this matches your installed version
const router = express_1.default.Router();
router.get('/scrape', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required and should be a string' });
    }
    try {
        const { data } = yield axios_1.default.get(url);
        if (!data) {
            return res.status(500).json({ error: 'Failed to retrieve HTML content from the URL' });
        }
        const $ = cheerio.load(data);
        const stats = {};
        let winner = '';
        // Find the element with a winner class
        const winnerClassElement = $('div[class*="mc-stats__stat-container--"]')
            .filter((_, el) => $(el).hasClass('mc-stats__stat-container--a-winner') || $(el).hasClass('mc-stats__stat-container--b-winner'))
            .attr('class');
        if (winnerClassElement) {
            // Determine if Player A or Player B is the winner
            if (winnerClassElement.includes('--a-winner')) {
                winner = 'Player A';
            }
            else if (winnerClassElement.includes('--b-winner')) {
                winner = 'Player B';
            }
        }
        else {
            winner = 'No winner information found';
        }
        // Scrape stats
        $('div.mc-stats__stat-container').each((index, element) => {
            const label = $(element).find('p.mc-stats__stat-label').text().trim();
            const playerAStat = $(element)
                .find('.mc-stats__stat-player-container--player-a .mc-stats__stat-player-number-primary')
                .text()
                .trim();
            const playerBStat = $(element)
                .find('.mc-stats__stat-player-container--player-b .mc-stats__stat-player-number-primary')
                .text()
                .trim();
            if (label) {
                stats[label] = {
                    playerA: playerAStat || 'N/A',
                    playerB: playerBStat || 'N/A',
                };
            }
        });
        if (Object.keys(stats).length === 0) {
            return res.status(404).json({ error: 'No stats found for the provided URL' });
        }
        res.json({ stats, winner });
        console.log(winner);
    }
    catch (error) {
        const err = error;
        console.error('Error scraping the URL:', err.message);
        res.status(500).json({ error: 'Failed to scrape data. Please check the URL or try again later.' });
    }
}));
exports.default = router;
