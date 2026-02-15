/**
 * Cart Manager - Handles shopping cart functionality
 * Uses localStorage for persistent cart data
 */

// Storage key
const CART_KEY = "fashion-store-cart";

/**
 * Initialize cart on page load
 * Updates cart badge and renders cart if on cart page
 */
function initCart() {
  updateCartBadge();

  // If on cart page, render cart items
  if (document.getElementById("cart-items-container")) {
    renderCart();
  }
}

/**
 * Get cart from localStorage
 * @returns {Array} Array of cart items
 */
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

/**
 * Save cart to localStorage
 * @param {Array} cart - Array of cart items
 */
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}

/**
 * Add item to cart
 * @param {Object} product - Product object to add
 * @param {number} quantity - Quantity to add (default: 1)
 * @param {string} size - Selected size (optional)
 * @param {string} color - Selected color (optional)
 * @returns {boolean} Success status
 */
function addToCart(product, quantity = 1, size = null, color = null) {
  if (!product || !product.id) {
    console.error("Invalid product provided to addToCart");
    return false;
  }

  const cart = getCart();

  // Check if item already exists in cart (same product, size, and color)
  const existingItemIndex = cart.findIndex(
    (item) =>
      item.id === product.id && item.size === size && item.color === color,
  );

  if (existingItemIndex > -1) {
    // Update quantity of existing item
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: size,
      color: color,
      addedAt: new Date().toISOString(),
    });
  }

  saveCart(cart);
  showNotification(`${product.name} added to cart!`);
  return true;
}

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID (productId-size-color)
 */
function removeFromCart(itemId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => {
    const cartItemId = `${item.id}-${item.size || "default"}-${item.color || "default"}`;
    return cartItemId !== itemId;
  });

  saveCart(updatedCart);
  renderCart();
  showNotification("Item removed from cart");
}

/**
 * Update item quantity in cart
 * @param {string} itemId - Cart item ID
 * @param {number} newQuantity - New quantity
 */
function updateCartItemQuantity(itemId, newQuantity) {
  if (newQuantity < 1) {
    removeFromCart(itemId);
    return;
  }

  const cart = getCart();
  const item = cart.find((item) => {
    const cartItemId = `${item.id}-${item.size || "default"}-${item.color || "default"}`;
    return cartItemId === itemId;
  });

  if (item) {
    item.quantity = newQuantity;
    saveCart(cart);
    renderCart();
  }
}

/**
 * Clear entire cart
 */
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}

/**
 * Get cart total price
 * @returns {number} Total price
 */
function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

/**
 * Get cart items count
 * @returns {number} Total number of items in cart
 */
function getCartItemCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Update cart badge in navbar
 */
function updateCartBadge() {
  const badgeElements = document.querySelectorAll(".cart-badge");
  const count = getCartItemCount();

  badgeElements.forEach((badge) => {
    badge.textContent = count;

    // Show/hide badge based on count
    if (count > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });
}

/**
 * Render cart items on cart page
 */
function renderCart() {
  const container = document.getElementById("cart-items-container");
  const emptyState = document.getElementById("cart-empty-state");
  const cartContent = document.getElementById("cart-content");
  const subtotalElement = document.getElementById("cart-subtotal");
  const totalElement = document.getElementById("cart-total");

  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    // Show empty state
    if (emptyState) emptyState.classList.remove("hidden");
    if (cartContent) cartContent.classList.add("hidden");
    return;
  }

  // Show cart content
  if (emptyState) emptyState.classList.add("hidden");
  if (cartContent) cartContent.classList.remove("hidden");

  // Render cart items
  container.innerHTML = cart
    .map((item) => {
      const itemId = `${item.id}-${item.size || "default"}-${item.color || "default"}`;
      const itemTotal = (item.price * item.quantity).toFixed(2);

      return `
            <div class="flex flex-col sm:flex-row gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
                <!-- Product Image -->
                <div class="w-full sm:w-24 h-24 flex-shrink-0 bg-zinc-100 dark:bg-zinc-800 rounded-md overflow-hidden">
                    <img src="${item.image}" alt="${item.name}" 
                        class="w-full h-full object-cover">
                </div>
                
                <!-- Product Details -->
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-zinc-900 dark:text-white truncate">
                        ${item.name}
                    </h3>
                    <div class="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        ${item.size ? `<span class="mr-3">Size: ${item.size}</span>` : ""}
                        ${item.color ? `<span>Color: ${item.color}</span>` : ""}
                    </div>
                    <div class="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                        $${item.price.toFixed(2)}
                    </div>
                </div>
                
                <!-- Quantity Controls -->
                <div class="flex items-center gap-3">
                    <button onclick="updateCartItemQuantity('${itemId}', ${item.quantity - 1})"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                        </svg>
                    </button>
                    <span class="w-8 text-center font-medium text-zinc-900 dark:text-white">${item.quantity}</span>
                    <button onclick="updateCartItemQuantity('${itemId}', ${item.quantity + 1})"
                        class="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                    </button>
                </div>
                
                <!-- Item Total & Remove -->
                <div class="flex flex-col items-end justify-between min-w-[100px]">
                    <div class="text-lg font-bold text-zinc-900 dark:text-white">
                        $${itemTotal}
                    </div>
                    <button onclick="removeFromCart('${itemId}')"
                        class="text-red-500 hover:text-red-600 dark:hover:text-red-400 text-sm flex items-center gap-1 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Remove
                    </button>
                </div>
            </div>
        `;
    })
    .join("");

  // Update totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 0 ? 9.99 : 0;
  const total = subtotal + shipping;

  if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;

  // Update shipping display
  const shippingElement = document.getElementById("cart-shipping");
  if (shippingElement) {
    shippingElement.textContent =
      shipping > 0 ? `$${shipping.toFixed(2)}` : "Free";
  }
}

/**
 * Show notification toast
 * @param {string} message - Message to display
 */
function showNotification(message) {
  // Create notification element if it doesn't exist
  let notification = document.getElementById("cart-notification");

  if (!notification) {
    notification = document.createElement("div");
    notification.id = "cart-notification";
    notification.className =
      "fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 z-50";
    document.body.appendChild(notification);
  }

  notification.textContent = message;

  // Show notification
  requestAnimationFrame(() => {
    notification.classList.remove("translate-y-20", "opacity-0");
  });

  // Hide after 3 seconds
  setTimeout(() => {
    notification.classList.add("translate-y-20", "opacity-0");
  }, 3000);
}

// Initialize cart when DOM is ready
document.addEventListener("DOMContentLoaded", initCart);

// Re-initialize cart badge when header component is dynamically loaded
document.addEventListener("componentLoaded", (e) => {
  if (e.detail && e.detail.id === "header") {
    updateCartBadge();
  }
});
