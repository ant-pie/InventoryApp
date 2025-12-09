# InventoryApp

A modern web application for managing retail store inventory. This application allows you to browse, add, delete, and update products with an easy-to-use interface.

## Features

- 📦 **Product Management**: Add, edit, and delete products
- 🔢 **Quantity Tracking**: Update product quantities easily
- 🔍 **Search & Filter**: Search products by name, description, or SKU
- 📊 **Dashboard Stats**: View total products, items, inventory value, and low stock alerts
- 🎨 **Modern UI**: Clean, responsive design that works on all devices
- 💾 **Local Database**: SQLite database with 20 pre-populated products

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ant-pie/InventoryApp.git
cd InventoryApp
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Start the server:
```bash
npm start
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Features in Detail

### Product Information
Each product includes:
- Name
- Description
- Category
- SKU (Stock Keeping Unit)
- Quantity in stock
- Price

### Operations
- **Browse Products**: View all products in a card-based grid layout
- **Add Product**: Click "Add New Product" to create a new product
- **Edit Product**: Click "Edit" on any product card to modify details
- **Update Quantity**: Quick quantity update with "Update Qty" button
- **Delete Product**: Remove products from inventory
- **Search**: Real-time search across product names, descriptions, and SKUs
- **Filter**: Filter products by category

### Pre-populated Database
The application comes with 20 sample products across different categories:
- Electronics (Mouse, Keyboard, Monitor, etc.)
- Office Supplies (Desk Lamp, Whiteboard, etc.)
- Furniture (Office Chair, Standing Desk, etc.)
- Stationery (Notebooks, Pens, etc.)

## Technology Stack

- **Backend**: Node.js with Express
- **Database**: SQLite with better-sqlite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Design**: Modern gradient UI with responsive layout

## API Endpoints

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `PUT /api/products/:id/quantity` - Update product quantity
- `DELETE /api/products/:id` - Delete product

## License

ISC