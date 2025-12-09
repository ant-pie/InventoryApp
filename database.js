const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database
const db = new Database(path.join(__dirname, 'inventory.db'));

// Initialize database schema
function initDatabase() {
  // Create products table
  const createTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      category TEXT,
      quantity INTEGER NOT NULL DEFAULT 0,
      price REAL NOT NULL,
      sku TEXT UNIQUE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `;
  
  db.exec(createTable);
  
  // Check if we need to seed data
  const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
  
  if (count.count === 0) {
    console.log('Seeding database with initial products...');
    seedDatabase();
  }
}

// Seed database with 20 products
function seedDatabase() {
  const products = [
    { name: 'Wireless Mouse', description: 'Ergonomic wireless mouse with 2.4GHz connection', category: 'Electronics', quantity: 45, price: 29.99, sku: 'ELEC-001' },
    { name: 'USB-C Cable', description: '6ft USB-C to USB-C cable, fast charging', category: 'Electronics', quantity: 150, price: 12.99, sku: 'ELEC-002' },
    { name: 'Laptop Stand', description: 'Aluminum adjustable laptop stand', category: 'Electronics', quantity: 30, price: 49.99, sku: 'ELEC-003' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit mechanical keyboard with blue switches', category: 'Electronics', quantity: 25, price: 89.99, sku: 'ELEC-004' },
    { name: 'Webcam HD', description: '1080p HD webcam with built-in microphone', category: 'Electronics', quantity: 20, price: 59.99, sku: 'ELEC-005' },
    { name: 'Desk Lamp', description: 'LED desk lamp with adjustable brightness', category: 'Office', quantity: 40, price: 34.99, sku: 'OFF-001' },
    { name: 'Office Chair', description: 'Ergonomic office chair with lumbar support', category: 'Furniture', quantity: 15, price: 249.99, sku: 'FURN-001' },
    { name: 'Standing Desk', description: 'Electric height-adjustable standing desk', category: 'Furniture', quantity: 10, price: 499.99, sku: 'FURN-002' },
    { name: 'Monitor 27"', description: '27-inch 4K UHD monitor with HDR', category: 'Electronics', quantity: 18, price: 399.99, sku: 'ELEC-006' },
    { name: 'Headphones', description: 'Wireless noise-cancelling over-ear headphones', category: 'Electronics', quantity: 35, price: 199.99, sku: 'ELEC-007' },
    { name: 'Notebook Set', description: 'Set of 3 premium lined notebooks', category: 'Stationery', quantity: 100, price: 15.99, sku: 'STAT-001' },
    { name: 'Pen Set', description: 'Professional ballpoint pen set, 12 pieces', category: 'Stationery', quantity: 75, price: 24.99, sku: 'STAT-002' },
    { name: 'Whiteboard', description: 'Magnetic dry-erase whiteboard 36x24 inches', category: 'Office', quantity: 22, price: 44.99, sku: 'OFF-002' },
    { name: 'File Cabinet', description: '3-drawer metal file cabinet with lock', category: 'Furniture', quantity: 12, price: 149.99, sku: 'FURN-003' },
    { name: 'Desk Organizer', description: 'Bamboo desktop organizer with compartments', category: 'Office', quantity: 60, price: 29.99, sku: 'OFF-003' },
    { name: 'Printer Paper', description: 'A4 printer paper, 500 sheets', category: 'Stationery', quantity: 200, price: 9.99, sku: 'STAT-003' },
    { name: 'Stapler', description: 'Heavy-duty desktop stapler', category: 'Office', quantity: 50, price: 14.99, sku: 'OFF-004' },
    { name: 'Scissors', description: '8-inch stainless steel scissors', category: 'Office', quantity: 80, price: 7.99, sku: 'OFF-005' },
    { name: 'Calculator', description: 'Scientific calculator with large display', category: 'Office', quantity: 45, price: 19.99, sku: 'OFF-006' },
    { name: 'Coffee Mug', description: 'Ceramic coffee mug, 14 oz', category: 'Kitchen', quantity: 90, price: 11.99, sku: 'KITCH-001' }
  ];
  
  const insert = db.prepare(`
    INSERT INTO products (name, description, category, quantity, price, sku)
    VALUES (@name, @description, @category, @quantity, @price, @sku)
  `);
  
  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(product);
    }
  });
  
  insertMany(products);
  console.log('Database seeded with 20 products');
}

// Database operations
const dbOps = {
  // Get all products
  getAllProducts: () => {
    return db.prepare('SELECT * FROM products ORDER BY id').all();
  },
  
  // Get product by id
  getProductById: (id) => {
    return db.prepare('SELECT * FROM products WHERE id = ?').get(id);
  },
  
  // Add new product
  addProduct: (product) => {
    const insert = db.prepare(`
      INSERT INTO products (name, description, category, quantity, price, sku)
      VALUES (@name, @description, @category, @quantity, @price, @sku)
    `);
    const result = insert.run(product);
    return result.lastInsertRowid;
  },
  
  // Update product quantity
  updateProductQuantity: (id, quantity) => {
    const update = db.prepare('UPDATE products SET quantity = ? WHERE id = ?');
    const result = update.run(quantity, id);
    return result.changes > 0;
  },
  
  // Update entire product
  updateProduct: (id, product) => {
    const update = db.prepare(`
      UPDATE products 
      SET name = @name, description = @description, category = @category, 
          quantity = @quantity, price = @price, sku = @sku
      WHERE id = @id
    `);
    const result = update.run({ ...product, id });
    return result.changes > 0;
  },
  
  // Delete product
  deleteProduct: (id) => {
    const del = db.prepare('DELETE FROM products WHERE id = ?');
    const result = del.run(id);
    return result.changes > 0;
  }
};

// Initialize database on module load
initDatabase();

module.exports = dbOps;
