/**
 * Checkout Manager - Handles checkout functionality
 * Supports both cart checkout and buy now checkout
 */

/**
 * Initialize checkout page
 * Determines checkout mode and renders appropriate order summary
 */
function initCheckout() {
  // Check if user is logged in
  if (!isLoggedIn()) {
    const currentUrl = encodeURIComponent(window.location.href);
    window.location.href = `login.html?redirect=${currentUrl}`;
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  if (mode === "buy-now") {
    // Buy Now mode - single product checkout
    renderBuyNowCheckout();
  } else {
    // Cart checkout mode
    renderCartCheckout();
  }

  // Setup checkout form
  setupCheckoutForm();
}

/**
 * Render Buy Now checkout (single product)
 */
function renderBuyNowCheckout() {
  const buyNowItem = JSON.parse(
    sessionStorage.getItem("buy-now-item") || "null",
  );

  if (!buyNowItem) {
    // No buy now item, redirect to shop
    window.location.href = "shop.html";
    return;
  }

  const container = document.getElementById("checkout-items-container");
  const summaryContainer = document.getElementById("checkout-summary");
  const checkoutTitle = document.getElementById("checkout-title");

  if (checkoutTitle) {
    checkoutTitle.textContent = "Buy Now Checkout";
  }

  // Render single item
  if (container) {
    container.innerHTML = `
            <div class="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <img src="${buyNowItem.image}" alt="${buyNowItem.name}" 
                    class="w-24 h-24 object-cover rounded-md bg-zinc-100 dark:bg-zinc-800">
                <div class="flex-1">
                    <h3 class="font-semibold text-zinc-900 dark:text-white">${buyNowItem.name}</h3>
                    <div class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        ${buyNowItem.size ? `Size: ${buyNowItem.size}` : ""}
                        ${buyNowItem.color ? `Color: ${buyNowItem.color}` : ""}
                    </div>
                    <div class="mt-2">
                        <span class="text-zinc-600 dark:text-zinc-400">Qty: ${buyNowItem.quantity}</span>
                    </div>
                    <div class="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                        $${(buyNowItem.price * buyNowItem.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        `;
  }

  // Calculate totals
  const subtotal = buyNowItem.price * buyNowItem.quantity;
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Render summary
  if (summaryContainer) {
    summaryContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span>$${shipping.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tax (8%)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="border-t border-zinc-200 dark:border-zinc-800 pt-3 mt-3">
                    <div class="flex justify-between text-xl font-bold text-zinc-900 dark:text-white">
                        <span>Total</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
  }
}

/**
 * Render Cart checkout (all cart items)
 */
function renderCartCheckout() {
  const cart = getCart();

  if (cart.length === 0) {
    // Empty cart, redirect to cart page
    window.location.href = "cart.html";
    return;
  }

  const container = document.getElementById("checkout-items-container");
  const summaryContainer = document.getElementById("checkout-summary");
  const checkoutTitle = document.getElementById("checkout-title");

  if (checkoutTitle) {
    checkoutTitle.textContent = "Cart Checkout";
  }

  // Render cart items
  if (container) {
    container.innerHTML = cart
      .map(
        (item) => `
            <div class="flex gap-4 p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <img src="${item.image}" alt="${item.name}" 
                    class="w-24 h-24 object-cover rounded-md bg-zinc-100 dark:bg-zinc-800">
                <div class="flex-1">
                    <h3 class="font-semibold text-zinc-900 dark:text-white">${item.name}</h3>
                    <div class="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        ${item.size ? `Size: ${item.size}` : ""}
                        ${item.color ? `Color: ${item.color}` : ""}
                    </div>
                    <div class="mt-2">
                        <span class="text-zinc-600 dark:text-zinc-400">Qty: ${item.quantity}</span>
                    </div>
                    <div class="mt-2 text-lg font-bold text-zinc-900 dark:text-white">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        `,
      )
      .join("");
  }

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  // Render summary
  if (summaryContainer) {
    summaryContainer.innerHTML = `
            <div class="space-y-3">
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span>$${shipping.toFixed(2)}</span>
                </div>
                <div class="flex justify-between text-zinc-600 dark:text-zinc-400">
                    <span>Tax (8%)</span>
                    <span>$${tax.toFixed(2)}</span>
                </div>
                <div class="border-t border-zinc-200 dark:border-zinc-800 pt-3 mt-3">
                    <div class="flex justify-between text-xl font-bold text-zinc-900 dark:text-white">
                        <span>Total</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        `;
  }
}

/**
 * Setup checkout form handlers
 */
function setupCheckoutForm() {
  const form = document.getElementById("checkout-form");

  if (form) {
    form.addEventListener("submit", handleCheckoutSubmit);
  }

  // Setup same-as-shipping checkbox
  const sameAsShipping = document.getElementById("same-as-shipping");
  if (sameAsShipping) {
    sameAsShipping.addEventListener("change", function () {
      const billingSection = document.getElementById("billing-address-section");
      if (billingSection) {
        billingSection.classList.toggle("hidden", this.checked);
      }
    });
  }
}

/**
 * Handle checkout form submission
 * @param {Event} e - Form submit event
 */
function handleCheckoutSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const orderData = {
    email: formData.get("email"),
    shipping: {
      firstName: formData.get("shipping-first-name"),
      lastName: formData.get("shipping-last-name"),
      address: formData.get("shipping-address"),
      city: formData.get("shipping-city"),
      state: formData.get("shipping-state"),
      zip: formData.get("shipping-zip"),
      country: formData.get("shipping-country"),
      phone: formData.get("shipping-phone"),
    },
    payment: {
      cardNumber: formData.get("card-number"),
      cardName: formData.get("card-name"),
      expiry: formData.get("card-expiry"),
      cvv: formData.get("card-cvv"),
    },
  };

  // Validate required fields
  if (!validateCheckoutForm(orderData)) {
    return;
  }

  // Process order
  processOrder(orderData);
}

/**
 * Validate checkout form data
 * @param {Object} data - Order data
 * @returns {boolean} Validation result
 */
function validateCheckoutForm(data) {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please enter a valid email address");
  }

  if (!data.shipping.firstName || !data.shipping.lastName) {
    errors.push("Please enter your full name");
  }

  if (!data.shipping.address || !data.shipping.city || !data.shipping.zip) {
    errors.push("Please enter your complete address");
  }

  if (!data.shipping.phone) {
    errors.push("Please enter your phone number");
  }

  if (!data.payment.cardNumber || data.payment.cardNumber.length < 16) {
    errors.push("Please enter a valid card number");
  }

  if (!data.payment.cardName) {
    errors.push("Please enter the name on your card");
  }

  if (!data.payment.expiry || !data.payment.cvv) {
    errors.push("Please enter card expiry and CVV");
  }

  if (errors.length > 0) {
    showCheckoutError(errors.join("<br>"));
    return false;
  }

  return true;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Validation result
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Show checkout error message
 * @param {string} message - Error message
 */
function showCheckoutError(message) {
  const errorContainer = document.getElementById("checkout-error");
  if (errorContainer) {
    errorContainer.innerHTML = message;
    errorContainer.classList.remove("hidden");

    // Scroll to error
    errorContainer.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Process the order
 * @param {Object} orderData - Order data
 */
function processOrder(orderData) {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get("mode");

  // Create order object
  const order = {
    id: generateOrderId(),
    date: new Date().toISOString(),
    customer: orderData,
    items:
      mode === "buy-now"
        ? [JSON.parse(sessionStorage.getItem("buy-now-item") || "{}")]
        : getCart(),
    mode: mode || "cart",
    status: "confirmed",
  };

  // Calculate totals
  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  order.subtotal = subtotal;
  order.shipping = 9.99;
  order.tax = subtotal * 0.08;
  order.total = subtotal + order.shipping + order.tax;

  // Save order to localStorage (for order history)
  saveOrder(order);

  // Clear cart if it was a cart checkout
  if (mode !== "buy-now") {
    clearCart();
  }

  // Clear buy now item
  sessionStorage.removeItem("buy-now-item");

  // Show success message and redirect
  showOrderSuccess(order);
}

/**
 * Generate unique order ID
 * @returns {string} Order ID
 */
function generateOrderId() {
  return "ORD-" + Date.now().toString(36).toUpperCase();
}

/**
 * Save order to localStorage
 * @param {Object} order - Order object
 */
function saveOrder(order) {
  const orders = JSON.parse(
    localStorage.getItem("fashion-store-orders") || "[]",
  );
  orders.push(order);
  localStorage.setItem("fashion-store-orders", JSON.stringify(orders));
}

/**
 * Show order success message
 * @param {Object} order - Order object
 */
function showOrderSuccess(order) {
  const container = document.querySelector(".checkout-container");

  if (container) {
    container.innerHTML = `
            <div class="max-w-2xl mx-auto text-center py-12">
                <div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg class="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Order Confirmed!
                </h1>
                <p class="text-gray-600 dark:text-gray-300 mb-6">
                    Thank you for your purchase. Your order <strong class="text-gray-900 dark:text-white">${order.id}</strong> has been confirmed.
                </p>
                <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8 text-left">
                    <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>
                    <div class="space-y-2 text-sm">
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Order Date</span>
                            <span class="text-gray-900 dark:text-white">${new Date(order.date).toLocaleDateString()}</span>
                        </div>
                        <div class="flex justify-between">
                            <span class="text-gray-600 dark:text-gray-400">Items</span>
                            <span class="text-gray-900 dark:text-white">${order.items.length}</span>
                        </div>
                        <div class="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                            <span class="text-gray-900 dark:text-white">Total</span>
                            <span class="text-gray-900 dark:text-white">$${order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div class="flex gap-4 justify-center">
                    <a href="shop.html" class="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Continue Shopping
                    </a>
                    <a href="../index.html" class="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                        Back to Home
                    </a>
                </div>
            </div>
        `;
  }
}

// Initialize checkout when DOM is ready
document.addEventListener("DOMContentLoaded", initCheckout);
