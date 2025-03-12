const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Habilita CORS para todas las rutas
app.use(cors());

// Configura el proxy para Musixmatch
app.use('/musixmatch', createProxyMiddleware({
  target: 'https://api.musixmatch.com',
  changeOrigin: true,
  pathRewrite: {
    '^/musixmatch': '', // Elimina el prefijo /musixmatch de la URL
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.url}`);
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