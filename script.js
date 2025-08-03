// Global state
let cart = [];
let products = [];

// DOM elements
const productsGrid = document.getElementById('products-grid');
const cartCount = document.getElementById('cart-count');
const cartEmpty = document.getElementById('cart-empty');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const totalPrice = document.getElementById('total-price');
const modalOverlay = document.getElementById('modal-overlay');
const orderSummary = document.getElementById('order-summary');
const modalTotalPrice = document.getElementById('modal-total-price');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  renderProducts();
  updateCartDisplay();
});

// Load products from JSON
async function loadProducts() {
  try {
    const response = await fetch('./data.json');
    products = await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Render products to the grid
function renderProducts() {
  productsGrid.innerHTML = products.map((product, index) => `
    <div class="product-card" data-product-index="${index}">
      <div class="product-image">
        <picture>
          <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
          <source media="(min-width: 768px)" srcset="${product.image.tablet}">
          <img src="${product.image.mobile}" alt="${product.name}" loading="lazy">
        </picture>
        <div class="add-to-cart-container">
          <button class="add-to-cart-btn" onclick="addToCart(${index})" aria-label="Add ${product.name} to cart">
            <img src="./assets/images/icon-add-to-cart.svg" alt="">
            Add to Cart
          </button>
          <div class="quantity-controls" style="display: none;">
            <button class="quantity-btn decrement" onclick="decrementQuantity(${index})" aria-label="Decrease quantity">
              <img src="./assets/images/icon-decrement-quantity.svg" alt="">
            </button>
            <span class="quantity-display">1</span>
            <button class="quantity-btn increment" onclick="incrementQuantity(${index})" aria-label="Increase quantity">
              <img src="./assets/images/icon-increment-quantity.svg" alt="">
            </button>
          </div>
        </div>
      </div>
      <div class="product-info">
        <p class="product-category">${product.category}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">$${product.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');
}

// Add product to cart
function addToCart(productIndex) {
  const product = products[productIndex];
  const existingItem = cart.find(item => item.productIndex === productIndex);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      productIndex,
      name: product.name,
      price: product.price,
      quantity: 1,
      thumbnail: product.image.thumbnail
    });
  }
  
  updateProductDisplay(productIndex);
  updateCartDisplay();
}

// Remove product from cart
function removeFromCart(productIndex) {
  cart = cart.filter(item => item.productIndex !== productIndex);
  updateProductDisplay(productIndex);
  updateCartDisplay();
}

// Increment quantity
function incrementQuantity(productIndex) {
  const cartItem = cart.find(item => item.productIndex === productIndex);
  if (cartItem) {
    cartItem.quantity += 1;
    updateProductDisplay(productIndex);
    updateCartDisplay();
  }
}

// Decrement quantity
function decrementQuantity(productIndex) {
  const cartItem = cart.find(item => item.productIndex === productIndex);
  if (cartItem) {
    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      updateProductDisplay(productIndex);
    } else {
      removeFromCart(productIndex);
    }
    updateCartDisplay();
  }
}

// Update product display (add to cart button vs quantity controls)
function updateProductDisplay(productIndex) {
  const productCard = document.querySelector(`[data-product-index="${productIndex}"]`);
  const addToCartBtn = productCard.querySelector('.add-to-cart-btn');
  const quantityControls = productCard.querySelector('.quantity-controls');
  const quantityDisplay = productCard.querySelector('.quantity-display');
  
  const cartItem = cart.find(item => item.productIndex === productIndex);
  
  if (cartItem) {
    addToCartBtn.style.display = 'none';
    quantityControls.style.display = 'flex';
    quantityDisplay.textContent = cartItem.quantity;
    productCard.classList.add('in-cart');
  } else {
    addToCartBtn.style.display = 'flex';
    quantityControls.style.display = 'none';
    productCard.classList.remove('in-cart');
  }
}

// Update cart display
function updateCartDisplay() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  cartCount.textContent = totalItems;
  
  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartItems.style.display = 'none';
    cartTotal.style.display = 'none';
  } else {
    cartEmpty.style.display = 'none';
    cartItems.style.display = 'block';
    cartTotal.style.display = 'block';
    
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          <div class="cart-item-details">
            <span class="cart-item-quantity">${item.quantity}x</span>
            <span class="cart-item-price">@ $${item.price.toFixed(2)}</span>
            <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
        <button class="remove-item-btn" onclick="removeFromCart(${item.productIndex})" aria-label="Remove ${item.name} from cart">
          <img src="./assets/images/icon-remove-item.svg" alt="">
        </button>
      </div>
    `).join('');
    
    totalPrice.textContent = `$${totalAmount.toFixed(2)}`;
  }
}

// Confirm order
document.getElementById('confirm-order-btn').addEventListener('click', () => {
  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  orderSummary.innerHTML = cart.map(item => `
    <div class="order-item">
      <div class="order-item-image">
        <img src="${item.thumbnail}" alt="${item.name}">
      </div>
      <div class="order-item-info">
        <h4>${item.name}</h4>
        <div class="order-item-details">
          <span class="order-quantity">${item.quantity}x</span>
          <span class="order-price">@ $${item.price.toFixed(2)}</span>
        </div>
      </div>
      <div class="order-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
    </div>
  `).join('');
  
  modalTotalPrice.textContent = `$${totalAmount.toFixed(2)}`;
  modalOverlay.style.display = 'flex';
  document.body.style.overflow = 'hidden'; // Prevent background scrolling
});

// Start new order
document.getElementById('new-order-btn').addEventListener('click', () => {
  cart = [];
  
  // Reset all product displays
  document.querySelectorAll('.product-card').forEach(card => {
    const productIndex = parseInt(card.dataset.productIndex);
    updateProductDisplay(productIndex);
  });
  
  updateCartDisplay();
  modalOverlay.style.display = 'none';
  document.body.style.overflow = 'auto';
});

// Close modal when clicking overlay
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
    modalOverlay.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});