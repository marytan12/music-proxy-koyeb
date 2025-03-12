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
