const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const products = db.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.getProductById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  try {
    const { name, description, category, quantity, price, sku } = req.body;
    
    if (!name || !price || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const id = db.addProduct({
      name,
      description: description || '',
      category: category || '',
      quantity: parseInt(quantity),
      price: parseFloat(price),
      sku: sku || ''
    });
    
    const newProduct = db.getProductById(id);
    res.status(201).json(newProduct);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to add product' });
    }
  }
});

// Update product quantity
app.put('/api/products/:id/quantity', (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (quantity === undefined) {
      return res.status(400).json({ error: 'Quantity is required' });
    }
    
    const success = db.updateProductQuantity(req.params.id, parseInt(quantity));
    
    if (success) {
      const product = db.getProductById(req.params.id);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update quantity' });
  }
});

// Update entire product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, description, category, quantity, price, sku } = req.body;
    
    if (!name || !price || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const success = db.updateProduct(req.params.id, {
      name,
      description: description || '',
      category: category || '',
      quantity: parseInt(quantity),
      price: parseFloat(price),
      sku: sku || ''
    });
    
    if (success) {
      const product = db.getProductById(req.params.id);
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const success = db.deleteProduct(req.params.id);
    
    if (success) {
      res.json({ message: 'Product deleted successfully' });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Inventory Management System is ready!');
});
