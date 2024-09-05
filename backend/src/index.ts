import express from 'express';
import config from '../config/index'; // Adjust the path based on your structure

const app = express();
const port = config.port; // Use the port from your config

app.get('/', (req, res) => res.send('Server is running'));

app.listen(port, () => console.log(`Server is running on port ${port}`));