# Tennis Journal App

Welcome to the Tennis Journal App, a platform designed to help tennis players track and analyze their matches, improve their game, and reflect on key learning points. Users can document important details from each match, such as the date, opponent, location, court surface, and lessons learned. This app provides an intuitive interface for keeping a personal record of tennis progress and insights.

## Features

- **Log Matches:** Record details such as the opponent, tournament name, location, court surface, and date of the match.
- **Track Performance:** Note strengths, weaknesses, and key takeaways from each match, helping players to identify patterns and areas for improvement.
- **Organized Layout:** Entries are neatly displayed, making it easy to review past matches and lessons.
- **Interactive Map Feature:** Using the Google Maps API, users can input the tournament location and see it marked on the map for a visual reference.

## How It Works

1. **Submit Match Entries:** Users fill out a form with key match information such as:
   - Opponent
   - Tournament Name
   - Location (with Google Maps integration)
   - Court Surface
   - Strengths
   - Weaknesses
   - Lessons Learned
2. **Review Journal:** Entries are stored and displayed in a clean, easy-to-navigate interface.
3. **Insights & Progress:** As more entries are added, players can track their improvement and see trends over time.

## Navigation

- **Home Page:** Overview of recent journal entries with the ability to filter by date, location, or tournament.
- **Journal Page:** View a detailed list of all past entries, with search and sorting options.
- **Add Entry Page:** Fill out the journal form to submit a new match entry.
- **Map Feature:** The Google Maps API integration allows users to see the location of the tournaments they've played, bringing a visual element to their match history.

## Technologies/Libraries/APIs

This project is built using the following technologies:

- **React.js** for the frontend
- **Express.js** and **MongoDB** for the backend
- **React Hook Form** for form validation
- **Axios** for handling API requests
- **Redux** for state management
- **JWT (JSON Web Tokens)** for user authentication
- **Google Maps API** to display tournament locations
- **@react-google-maps/api** to handle map rendering in the frontend
- **CSS3** for styling and responsive design
