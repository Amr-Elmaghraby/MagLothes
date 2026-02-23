/**
 * Products Manager - Handles product loading, display, and interactions
 * Loads products from external JSON file using fetch API
 */

// Product data cache
let productsCache = null;
let featuredProductsCache = null;
let activeCategory = null;

/**
 * Initialize products on page load
 * Loads products and renders them based on page context
 */
async function initProducts() {
  // Load and render featured products on home page
  const featuredContainer = document.getElementById(
    "featured-products-container",
  );
  if (featuredContainer) {
    const featuredProducts = await getFeaturedProducts();
    renderProductGrid(featuredProducts, featuredContainer);
  }

  // Load and render all products on shop page
  const shopContainer = document.getElementById("shop-products-container");
  if (shopContainer) {
    // Check for category in URL
    const urlParams = new URLSearchParams(window.location.search);
    activeCategory = urlParams.get("category");

    let products;
    if (activeCategory) {
      // Filter by category from URL
      products = await getProductsByCategory(activeCategory);
    } else {
      products = await getAllProducts();
    }

    renderProductGrid(products, shopContainer);

    // Initialize category filters
    initCategoryFilters();
  }

  // Check for product detail view
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get("product");
  if (productId) {
    showProductDetail(parseInt(productId));
  }
}

/**
 * Fetch all products from JSON file
 * @returns {Promise<Array>} Array of product objects
 */
async function getAllProducts() {
  if (productsCache) {
    return productsCache;
  }

  try {
    const response = await fetch("./data/products.json");
    
    if (!response.ok) {
      throw new Error("Failed to load products");
    }

    const data = await response.json();
    productsCache = data.products || [];
    return productsCache;
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

/**
 * Get featured products
 * @returns {Promise<Array>} Array of featured products
 */
async function getFeaturedProducts() {
  if (featuredProductsCache) {
    return featuredProductsCache;
  }

  const products = await getAllProducts();
  featuredProductsCache = products.filter((p) => p.featured);
  return featuredProductsCache;
}

/**
 * Get product by ID
 * @param {number} id - Product ID
 * @returns {Promise<Object|null>} Product object or null
 */
async function getProductById(id) {
  const products = await getAllProducts();
  return products.find((p) => p.id === id) || null;
}

/**
 * Get products by category
 * @param {string} category - Category name
 * @returns {Promise<Array>} Array of products in category
 */
async function getProductsByCategory(category) {
  const products = await getAllProducts();
  if (category === "sale") {
    return products.filter((p) => p.onSale === true);
  }
  return products.filter((p) => p.category === category);
}

/**
 * Render product grid
 * @param {Array} products - Array of products to render
 * @param {HTMLElement} container - Container element
 */
function renderProductGrid(products, container) {
  if (!container) return;
  
  if (products.length === 0) {
    container.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-gray-500 dark:text-gray-400">No products found</p>
            </div>
        `;
    return;
  }

  container.innerHTML = products
    .map((product) => createProductCard(product))
    .join("");
}

/**
 * Create product card HTML
 * @param {Object} product - Product object
 * @returns {string} HTML string
 */
function createProductCard(product) {
  const priceDisplay =
    product.onSale && product.originalPrice
      ? `<span class="text-xl font-bold text-red-500 dark:text-red-400">$${product.price.toFixed(2)}</span>
           <span class="text-sm text-zinc-400 dark:text-zinc-500 line-through ml-2">$${product.originalPrice.toFixed(2)}</span>`
      : `<span class="text-xl font-bold text-zinc-900 dark:text-white">$${product.price.toFixed(2)}</span>`;

  return `
        <div class="group bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <!-- Product Image -->
            <div class="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img src="${product.image}" alt="${product.name}" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy">
                
                <!-- Quick Actions Overlay -->
                <div class="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button onclick="viewProduct(${product.id})" 
                        class="bg-white text-zinc-900 px-4 py-2 rounded-full font-medium hover:bg-zinc-100 transition-colors transform hover:scale-105 shadow-lg">
                        View Details
                    </button>
                </div>
                
                ${
                  product.featured
                    ? `
                    <span class="absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Featured
                    </span>
                `
                    : ""
                }
                
                ${
                  product.onSale
                    ? `
                    <span class="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                    </span>
                `
                    : ""
                }
            </div>
            
            <!-- Product Info -->
            <div class="p-4">
                <div class="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-1">
                    ${product.category}
                </div>
                <h3 class="font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-1" title="${product.name}">
                    ${product.name}
                </h3>
                <p class="text-zinc-600 dark:text-zinc-400 text-sm mb-3 line-clamp-2">
                    ${product.description}
                </p>
                
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        ${priceDisplay}
                    </div>
                    
                    <div class="flex gap-2">
                        <button onclick="quickAddToCart(${product.id})" 
                            class="p-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                            title="Add to Cart">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                        </button>
                        <button onclick="buyNow(${product.id})" 
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            title="Buy Now">
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * View product details
 * @param {number} productId - Product ID
 */
async function viewProduct(productId) {
  const product = await getProductById(productId);
  if (!product) return;

  // On shop page, show modal
  const modal = document.getElementById("product-modal");
  if (modal) {
    showProductModal(product);
  } else {
    // Navigate to shop page with product parameter
    window.location.href = `./pages/shop.html?product=${productId}`;
  }
}

/**
 * Show product detail modal
 * @param {Object} product - Product object
 */
function showProductModal(product) {
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("product-modal-content");

  if (!modal || !modalContent) return;

  // Generate size options
  const sizeOptions = product.sizes
    ? product.sizes
        .map(
          (size) =>
            `<button type="button" class="size-option px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" data-size="${size}">${size}</button>`,
        )
        .join("")
    : "";

  // Generate color options
  const colorOptions = product.colors
    ? product.colors
        .map(
          (color) =>
            `<button type="button" class="color-option px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" data-color="${color}">${color}</button>`,
        )
        .join("")
    : "";

  modalContent.innerHTML = `
        <div class="grid md:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div class="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
            </div>
            
            <!-- Product Details -->
            <div class="flex flex-col">
                <div class="text-sm text-zinc-500 dark:text-zinc-500 uppercase tracking-wide mb-2">
                    ${product.category} / ${product.subcategory}
                </div>
                <h2 class="text-3xl font-bold text-zinc-900 dark:text-white mb-4">${product.name}</h2>
                <div class="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    $${product.price.toFixed(2)}
                </div>
                <p class="text-zinc-600 dark:text-zinc-400 mb-6">${product.description}</p>
                
                ${
                  sizeOptions
                    ? `
                    <div class="mb-4">
                        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Size</label>
                        <div class="flex flex-wrap gap-2" id="size-selector">
                            ${sizeOptions}
                        </div>
                    </div>
                `
                    : ""
                }
                
                ${
                  colorOptions
                    ? `
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Color</label>
                        <div class="flex flex-wrap gap-2" id="color-selector">
                            ${colorOptions}
                        </div>
                    </div>
                `
                    : ""
                }
                
                <div class="mb-6">
                    <label class="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Quantity</label>
                    <div class="flex items-center gap-3">
                        <button type="button" onclick="updateModalQuantity(-1)" class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/></svg>
                        </button>
                        <span id="modal-quantity" class="text-xl font-medium w-8 text-center text-zinc-900 dark:text-white">1</span>
                        <button type="button" onclick="updateModalQuantity(1)" class="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                        </button>
                    </div>
                </div>
                
                <div class="flex gap-4 mt-auto">
                    <button onclick="addToCartFromModal(${product.id})" 
                        class="flex-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white py-3 px-6 rounded-lg font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        Add to Cart
                    </button>
                    <button onclick="buyNowFromModal(${product.id})" 
                        class="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    `;

  // Setup selection handlers
  setupSelectionHandlers();

  // Show modal
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

/**
 * Setup size and color selection handlers
 */
function setupSelectionHandlers() {
  // Size selection
  document.querySelectorAll(".size-option").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".size-option").forEach((b) => {
        b.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
        b.classList.add("border-gray-300", "dark:border-gray-600");
      });
      this.classList.add("bg-indigo-600", "text-white", "border-indigo-600");
      this.classList.remove("border-gray-300", "dark:border-gray-600");
    });
  });

  // Color selection
  document.querySelectorAll(".color-option").forEach((btn) => {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".color-option").forEach((b) => {
        b.classList.remove("bg-indigo-600", "text-white", "border-indigo-600");
        b.classList.add("border-gray-300", "dark:border-gray-600");
      });
      this.classList.add("bg-indigo-600", "text-white", "border-indigo-600");
      this.classList.remove("border-gray-300", "dark:border-gray-600");
    });
  });
}

/**
 * Update quantity in product modal
 * @param {number} change - Amount to change (-1 or 1)
 */
function updateModalQuantity(change) {
  const quantityEl = document.getElementById("modal-quantity");
  if (!quantityEl) return;

  let quantity = parseInt(quantityEl.textContent) + change;
  if (quantity < 1) quantity = 1;
  if (quantity > 10) quantity = 10;

  quantityEl.textContent = quantity;
}

/**
 * Get selected options from modal
 * @returns {Object} Selected size and color
 */
function getSelectedOptions() {
  const selectedSize = document.querySelector(".size-option.bg-indigo-600");
  const selectedColor = document.querySelector(".color-option.bg-indigo-600");

  return {
    size: selectedSize ? selectedSize.dataset.size : null,
    color: selectedColor ? selectedColor.dataset.color : null,
  };
}

/**
 * Add to cart from product modal
 * @param {number} productId - Product ID
 */
async function addToCartFromModal(productId) {
  const product = await getProductById(productId);
  if (!product) return;

  const quantity = parseInt(
    document.getElementById("modal-quantity")?.textContent || "1",
  );
  const { size, color } = getSelectedOptions();

  addToCart(product, quantity, size, color);
  closeProductModal();
}

/**
 * Buy now from product modal
 * @param {number} productId - Product ID
 */
async function buyNowFromModal(productId) {
  const product = await getProductById(productId);
  if (!product) return;

  const quantity = parseInt(
    document.getElementById("modal-quantity")?.textContent || "1",
  );
  const { size, color } = getSelectedOptions();

  // Store buy now item in sessionStorage
  const buyNowItem = {
    ...product,
    quantity,
    size,
    color,
    isBuyNow: true,
  };

  sessionStorage.setItem("buy-now-item", JSON.stringify(buyNowItem));

  // Close modal and redirect to checkout
  closeProductModal();
  window.location.href = "checkout.html?mode=buy-now";
}

/**
 * Close product modal
 */
function closeProductModal() {
  const modal = document.getElementById("product-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

/**
 * Quick add to cart (without opening modal)
 * @param {number} productId - Product ID
 */
async function quickAddToCart(productId) {
  const product = await getProductById(productId);
  if (product) {
    addToCart(product, 1, null, null);
  }
}

/**
 * Buy now - redirect to checkout with single product
 * @param {number} productId - Product ID
 */
async function buyNow(productId) {
  const product = await getProductById(productId);
  if (!product) return;

  // Store buy now item in sessionStorage
  const buyNowItem = {
    ...product,
    quantity: 1,
    size: null,
    color: null,
    isBuyNow: true,
  };

  sessionStorage.setItem("buy-now-item", JSON.stringify(buyNowItem));

  // Redirect to checkout
  if(window.location.href.includes("index.html")){
    window.location.href = "pages/checkout.html?mode=buy-now";
  }
  else{
    window.location.href = "checkout.html?mode=buy-now";
  }
}

/**
 * Initialize category filters
 * @param {string} activeCategory - The category to set as active initially
 */
function initCategoryFilters() {
  const filterButtons = document.querySelectorAll(".category-filter");

  // Set initial active state based on URL parameter
  if (!activeCategory) {
    activeCategory = "all";
  }

  filterButtons.forEach((btn) => {
    if (btn.dataset.category === activeCategory) {
      btn.classList.remove(
          "bg-gray-200",
          "dark:bg-gray-700",
          "text-gray-700",
          "dark:text-gray-300",
        );
        btn.classList.add("bg-indigo-600", "text-white");
      } else {
        btn.classList.remove("bg-indigo-600", "text-white");
        btn.classList.add(
          "bg-gray-200",
          "dark:bg-gray-700",
          "text-gray-700",
          "dark:text-gray-300",
        );
      }
    });

  filterButtons.forEach((button) => {
    button.addEventListener("click", async function () {
      activeCategory = this.dataset.category;
      console.log(activeCategory);
      
      // Update active state
      filterButtons.forEach((btn) => {
        btn.classList.remove("bg-indigo-600", "text-white");
        btn.classList.add(
          "bg-gray-200",
          "dark:bg-gray-700",
          "text-gray-700",
          "dark:text-gray-300",
        );
      });
      this.classList.remove(
        "bg-gray-200",
        "dark:bg-gray-700",
        "text-gray-700",
        "dark:text-gray-300",
      );
      this.classList.add("bg-indigo-600", "text-white");

      // Filter products
      const container = document.getElementById("shop-products-container");
      if (container) {
        const products =
          activeCategory === "all"
            ? await getAllProducts()
            : await getProductsByCategory(activeCategory);
        renderProductGrid(products, container);
      }

      // Update URL without reloading
      const url = new URL(window.location);
      if (activeCategory === "all") {
        url.searchParams.delete("category");
      } else {
        url.searchParams.set("category", activeCategory);
      }
      window.history.replaceState({}, "", url);
    });
  });
}

/**
 * Show product detail view (for shop page with URL parameter)
 * @param {number} productId - Product ID
 */
async function showProductDetail(productId) {
  const product = await getProductById(productId);
  if (!product) return;

  // Show modal with product details
  showProductModal(product);
}

// Close modal when clicking outside
document.addEventListener("click", function (e) {
  const modal = document.getElementById("product-modal");
  if (modal && e.target === modal) {
    closeProductModal();
  }
});

// Initialize products when DOM is ready
document.addEventListener("DOMContentLoaded", initProducts);

// Search functionality
document.getElementById("search-input")?.addEventListener("input", async function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const products = await getAllProducts();
    
    const filtered = products.filter(
      (p) =>{
        const matchedCategory = activeCategory === "all" ? true : p.category === activeCategory;
        return matchedCategory &&
        (
          p.name.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        )
      }
    );

    const container = document.getElementById("shop-products-container");
    renderProductGrid(filtered, container);
  });

