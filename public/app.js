// State management
let products = [];
let filteredProducts = [];
let editingProductId = null;

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const quantityModal = document.getElementById('quantityModal');
const productForm = document.getElementById('productForm');
const quantityForm = document.getElementById('quantityForm');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addProductBtn').addEventListener('click', openAddModal);
    productForm.addEventListener('submit', handleProductSubmit);
    quantityForm.addEventListener('submit', handleQuantitySubmit);
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
}

// API calls
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        products = await response.json();
        filteredProducts = [...products];
        renderProducts();
        updateStats();
        populateCategoryFilter();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products');
    }
}

async function addProduct(productData) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to add product');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function updateProduct(id, productData) {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update product');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function updateQuantity(id, quantity) {
    try {
        const response = await fetch(`/api/products/${id}/quantity`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity })
        });
        
        if (!response.ok) {
            throw new Error('Failed to update quantity');
        }
        
        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        
        return true;
    } catch (error) {
        throw error;
    }
}

// UI functions
function renderProducts() {
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <h3>No products found</h3>
                <p>Add your first product to get started!</p>
            </div>
        `;
        return;
    }
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-header">
                <div>
                    <div class="product-name">${escapeHtml(product.name)}</div>
                    ${product.category ? `<span class="product-category">${escapeHtml(product.category)}</span>` : ''}
                </div>
            </div>
            ${product.description ? `<p class="product-description">${escapeHtml(product.description)}</p>` : ''}
            ${product.sku ? `<div class="product-sku">SKU: ${escapeHtml(product.sku)}</div>` : ''}
            <div class="product-details">
                <div class="product-detail">
                    <span class="detail-label">Quantity</span>
                    <span class="detail-value quantity-value ${product.quantity < 20 ? 'quantity-low' : ''}">${product.quantity}</span>
                </div>
                <div class="product-detail">
                    <span class="detail-label">Price</span>
                    <span class="detail-value price-value">$${product.price.toFixed(2)}</span>
                </div>
            </div>
            <div class="product-actions">
                <button class="btn btn-small btn-primary" onclick="openQuantityModal(${product.id})">
                    Update Qty
                </button>
                <button class="btn btn-small btn-secondary" onclick="openEditModal(${product.id})">
                    Edit
                </button>
                <button class="btn btn-small btn-danger" onclick="handleDelete(${product.id})">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const totalProducts = products.length;
    const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.price), 0);
    const lowStockCount = products.filter(p => p.quantity < 20).length;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('totalValue').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('lowStockCount').textContent = lowStockCount;
}

function populateCategoryFilter() {
    const categories = [...new Set(products.map(p => p.category).filter(c => c))];
    categoryFilter.innerHTML = '<option value="">All Categories</option>' +
        categories.map(cat => `<option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>`).join('');
}

function filterProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    
    filteredProducts = products.filter(product => {
        const matchesSearch = 
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm)) ||
            (product.sku && product.sku.toLowerCase().includes(searchTerm));
        
        const matchesCategory = !category || product.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    renderProducts();
}

// Modal functions
function openAddModal() {
    editingProductId = null;
    document.getElementById('modalTitle').textContent = 'Add New Product';
    productForm.reset();
    document.getElementById('productId').value = '';
    productModal.classList.add('active');
}

function openEditModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    editingProductId = id;
    document.getElementById('modalTitle').textContent = 'Edit Product';
    document.getElementById('productId').value = id;
    document.getElementById('productName').value = product.name;
    document.getElementById('productDescription').value = product.description || '';
    document.getElementById('productCategory').value = product.category || '';
    document.getElementById('productSku').value = product.sku || '';
    document.getElementById('productQuantity').value = product.quantity;
    document.getElementById('productPrice').value = product.price;
    productModal.classList.add('active');
}

function closeModal() {
    productModal.classList.remove('active');
    productForm.reset();
    editingProductId = null;
}

function openQuantityModal(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    document.getElementById('quantityProductId').value = id;
    document.getElementById('newQuantity').value = product.quantity;
    quantityModal.classList.add('active');
}

function closeQuantityModal() {
    quantityModal.classList.remove('active');
    quantityForm.reset();
}

// Form handlers
async function handleProductSubmit(e) {
    e.preventDefault();
    
    const productData = {
        name: document.getElementById('productName').value,
        description: document.getElementById('productDescription').value,
        category: document.getElementById('productCategory').value,
        sku: document.getElementById('productSku').value,
        quantity: parseInt(document.getElementById('productQuantity').value),
        price: parseFloat(document.getElementById('productPrice').value)
    };
    
    try {
        if (editingProductId) {
            await updateProduct(editingProductId, productData);
            showSuccess('Product updated successfully!');
        } else {
            await addProduct(productData);
            showSuccess('Product added successfully!');
        }
        
        closeModal();
        await loadProducts();
    } catch (error) {
        showError(error.message);
    }
}

async function handleQuantitySubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('quantityProductId').value;
    const quantity = parseInt(document.getElementById('newQuantity').value);
    
    try {
        await updateQuantity(id, quantity);
        showSuccess('Quantity updated successfully!');
        closeQuantityModal();
        await loadProducts();
    } catch (error) {
        showError(error.message);
    }
}

async function handleDelete(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) {
        return;
    }
    
    try {
        await deleteProduct(id);
        showSuccess('Product deleted successfully!');
        await loadProducts();
    } catch (error) {
        showError(error.message);
    }
}

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    alert(message);
}

function showError(message) {
    alert('Error: ' + message);
}

// Close modals on outside click
window.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeModal();
    }
    if (e.target === quantityModal) {
        closeQuantityModal();
    }
});
