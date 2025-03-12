const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:15501', 'file://', '*'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
}));

app.use('/musixmatch', createProxyMiddleware({
    target: 'https://api.musixmatch.com',
    changeOrigin: true,
    pathRewrite: {
        '^/musixmatch': '', // Elimina el prefijo /musixmatch de la URL
    },
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Proxying request from ${req.ip}: ${req.originalUrl}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        console.log(`Response from Musixmatch: ${proxyRes.statusCode}`);
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    onError: (err, req, res) => {
        console.error(`Proxy error: ${err.message}`);
        res.status(500).json({ error: 'Error en el proxy', details: err.message });
    },
}));

app.get('/test', (req, res) => {
    res.send('Proxy funcionando');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});