const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Habilita CORS con opciones específicas
app.use(cors({
  origin: 'file://', // Permite solicitudes desde Cordova (file://)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configura el proxy para Musixmatch
app.use('/musixmatch', createProxyMiddleware({
  target: 'https://api.musixmatch.com',
  changeOrigin: true,
  pathRewrite: {
    '^/musixmatch': '', // Elimina el prefijo /musixmatch de la URL
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request from ${req.ip} to: ${req.url}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response with status: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).send('Error en el proxy');
  },
}));

// Maneja las solicitudes al puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
app.get('/test', (req, res) => {
  res.send('Proxy funcionando');
});