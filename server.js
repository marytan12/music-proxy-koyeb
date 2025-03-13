const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Permitir CORS
    next();
});

app.get('/proxy', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    try {
        const response = await fetch(url);
        const data = await response.text(); // Usar .text() para HTML si haces scraping
        res.send(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Proxy running on port ${port}`));