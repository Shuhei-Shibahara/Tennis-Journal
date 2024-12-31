import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio'; // Ensure this matches your installed version
const router = express.Router();
router.get('/scrape', async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required and should be a string' });
    }
    try {
        const { data } = await axios.get(url);
        if (!data) {
            return res.status(500).json({ error: 'Failed to retrieve HTML content from the URL' });
        }
        const $ = cheerio.load(data);
        const statsArray = [];
        let winner = '';
        const winnerClassElement = $('div[class*="mc-stats__stat-container--"]')
            .filter((_, el) => $(el).hasClass('mc-stats__stat-container--a-winner') || $(el).hasClass('mc-stats__stat-container--b-winner'))
            .attr('class');
        if (winnerClassElement) {
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
        $('div.mc-stats__stat-container').each((index, element) => {
            const label = $(element).find('p.mc-stats__stat-label').text().trim();
            const playerAStat = parseFloat($(element)
                .find('.mc-stats__stat-player-container--player-a .mc-stats__stat-player-number-primary')
                .text()
                .trim()
                .replace('%', '')) || 0;
            const playerBStat = parseFloat($(element)
                .find('.mc-stats__stat-player-container--player-b .mc-stats__stat-player-number-primary')
                .text()
                .trim()
                .replace('%', '')) || 0;
            if (label) {
                statsArray.push({
                    stat: label,
                    playerA: playerAStat,
                    playerB: playerBStat,
                });
            }
        });
        if (statsArray.length === 0) {
            return res.status(404).json({ error: 'No stats found for the provided URL' });
        }
        console.log(statsArray.slice(0, 14), winner);
        res.json({ stats: statsArray.slice(0, 14),
            winner: winner
        });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('Error scraping the URL:', error.message);
            res.status(500).json({ error: 'Failed to scrape data. Please check the URL or try again later.' });
        }
        else {
            console.error('Unknown error occurred:', error);
            res.status(500).json({ error: 'An unknown error occurred. Please try again later.' });
        }
    }
});
export default router;
