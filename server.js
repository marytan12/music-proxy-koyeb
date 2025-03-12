const express = require('express');
const cors = require('cors'); // Agregamos el middleware cors
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express(); // Instancia de Express

// Configura CORS explícitamente para permitir orígenes de Cordova
app.use(cors({
  origin: ['http://127.0.0.1:15501', 'file://', '*'], // Permite estos orígenes
  methods: ['GET', 'POST', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
  credentials: false // No necesitamos credenciales para este caso
}));

// Configura el proxy para Musixmatch
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
    console.log(`Proxying request from ${req.ip}: ${req.originalUrl}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Response from Musixmatch: ${proxyRes.statusCode}`);
    // Forzamos el encabezado CORS en la respuesta
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  onError: (err, req, res) => {
    console.error(`Proxy error: ${err.message}`);
    res.status(500).json({ error: 'Error en el proxy', details: err.message });
  },
}));

// Endpoint de prueba para depuración
app.get('/test', (req, res) => {
  res.send('Proxy funcionando');
});

// Maneja las solicitudes al puerto definido por el entorno o 3000 por defecto
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});