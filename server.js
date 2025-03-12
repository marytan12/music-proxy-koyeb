const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express(); // Aquí se crea la instancia de Express

app.use('/musixmatch', createProxyMiddleware({
  target: 'https://api.musixmatch.com',
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // Verifica si la solicitud tiene un parámetro 'url'
    const apiUrl = req.query.url;
    if (!apiUrl) {
      return '/ws/1.1/'; // Redirige a la API base si no hay una URL específica
    }
    return apiUrl.replace('https://api.musixmatch.com', '');
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request: ${req.originalUrl}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from Musixmatch: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).json({ error: 'Error en el proxy', details: err.message });
  },
}));

// Asegúrate de que el servidor escuche en un puerto
app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
