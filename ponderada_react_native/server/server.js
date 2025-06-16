const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/products', (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.per_page) || 10;
    
    const db = router.db.getState();
    const products = Array.isArray(db.products) ? db.products : [];
    
    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedProducts = products.slice(start, end);
    
    const pagination = {
      total: products.length,
      per_page: perPage,
      current_page: page,
      last_page: Math.ceil(products.length / perPage),
      from: start + 1,
      to: Math.min(end, products.length)
    };
    
    res.json({
      data: paginatedProducts,
      pagination
    });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Use default router
server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
}); 