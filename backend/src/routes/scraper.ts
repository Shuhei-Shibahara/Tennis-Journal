import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio'; // For HTML parsing

const router = express.Router();

// Scrape route
router.get('/scrape', async (req, res) => {
  const { url } = req.query;

  // Validate URL parameter
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required and should be a string' });
  }

  try {
    // Fetch the HTML content of the page
    const { data } = await axios.get(url);

    // Log the data to check if the HTML content is fetched correctly
    if (!data) {
      return res.status(500).json({ error: 'Failed to retrieve HTML content from the URL' });
    }

    console.log('HTML content fetched successfully', data);

    const $ = cheerio.load(data);

    // Initialize the stats object
    const stats: { [key: string]: { playerA: string | number; playerB: string | number } } = {};

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
          playerA: playerAStat || 'N/A',  // Default to 'N/A' if player A stat is missing
          playerB: playerBStat || 'N/A',  // Default to 'N/A' if player B stat is missing
        };
      }
    });

    // Check if stats were found
    if (Object.keys(stats).length === 0) {
      return res.status(404).json({ error: 'No stats found for the provided URL' });
    }

    // Return the scraped stats
    res.json({ stats });

  } catch (error: unknown) {
    // Assert the error type to Error and access the message property
    const err = error as Error;
    console.error('Error scraping the URL:', err.message);
    // Send a detailed error response
    res.status(500).json({ error: 'Failed to scrape data, please check the URL or try again later.' });
  }
});

export default router;
