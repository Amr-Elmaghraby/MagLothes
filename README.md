<p align="center">
  <img src="./assets/icon/favicon.svg" alt="MagLothes Logo" width="80" />
</p>

<h1 align="center">MagLothes</h1>

<p align="center">
  <strong>Your Style, Your Way</strong> — A modern clothes e-commerce web application
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License" />
</p>

---

## ✨ Features

| Feature                    | Description                                                          |
| -------------------------- | -------------------------------------------------------------------- |
| 🛍️ **Product Catalog**     | Browse 24+ products across Men, Women, Accessories & Sale categories |
| 🔍 **Search & Filter**     | Real-time product search with category filtering                     |
| 🛒 **Shopping Cart**       | Add, remove, and update quantities with persistent localStorage      |
| 💳 **Checkout Flow**       | Complete checkout with form validation and order confirmation        |
| 🔐 **Authentication**      | User registration & login with strong password enforcement           |
| 🌗 **Dark / Light Mode**   | Toggle theme with preference saved to localStorage                   |
| 📱 **Responsive Design**   | Fully responsive layout for mobile, tablet, and desktop              |
| 📦 **Reusable Components** | Dynamic header & footer loaded via JavaScript                        |
| 📰 **Newsletter**          | Email subscription section on the homepage                           |

---

## 📂 Project Structure

```
MagLothes/
├── index.html              # Homepage — hero, categories, featured products, newsletter
├── pages/
│   ├── shop.html            # Product listing with search & category filters
│   ├── cart.html             # Shopping cart page
│   ├── checkout.html         # Checkout form & order summary
│   ├── login.html            # User login page
│   └── register.html         # User registration page
├── js/
│   ├── main.js               # App entry point
│   ├── products.js           # Product loading, rendering, modals & search
│   ├── cart.js                # Cart CRUD operations & notifications
│   ├── checkout.js            # Checkout form handling & order processing
│   ├── auth.js                # Registration, login, session management
│   ├── theme.js               # Dark/light mode toggle & persistence
│   └── components.js          # Dynamic header/footer loader
├── components/
│   ├── header.html            # Shared navigation header
│   └── footer.html            # Shared footer
├── data/
│   └── products.json          # Product catalog (24 items)
├── assets/
│   ├── icon/                  # Favicon
│   └── img/                   # Product images, hero image, category images
└── LICENSE                    # MIT License
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A local web server (required for `fetch()` calls to load JSON data and components)

### Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/Amr-Elmaghraby/MagLothes.git
   cd MagLothes
   ```

2. **Start a local development server** — pick any of these options:

   ```bash
   # Using VS Code Live Server extension (recommended)
   # Right-click index.html → "Open with Live Server"

   # Using Python
   python -m http.server 5500

   # Using Node.js
   npx serve .
   ```

3. **Open in browser**
   ```
   http://localhost:5500
   ```

---

## 🖥️ Pages Overview

### 🏠 Homepage (`index.html`)

Hero banner with call-to-action, category cards linking to filtered shop views, dynamically loaded featured products, service highlights (free shipping, secure payment, easy returns), and a newsletter signup form.

### 🛍️ Shop (`pages/shop.html`)

Full product grid with category tabs (All, Men, Women, Accessories, Sale), real-time search bar, product detail modals with size/color selection, and quick add-to-cart functionality.

### 🛒 Cart (`pages/cart.html`)

Displays all cart items with quantity controls, item removal, price breakdown, and a link to proceed to checkout.

### 💳 Checkout (`pages/checkout.html`)

Supports both "Buy Now" (single item) and cart checkout modes. Includes shipping & billing form validation, order summary, and order confirmation with a generated order ID.

### 🔐 Login & Register (`pages/login.html`, `pages/register.html`)

Secure authentication forms with client-side validation. Password requirements: minimum 8 characters, uppercase, lowercase, number, and special character.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup
- **Tailwind CSS** (CDN) — Utility-first styling with dark mode support
- **Vanilla JavaScript** — No frameworks, modular architecture
- **localStorage / sessionStorage** — Persistent cart, user data, theme preference & session management
- **Fetch API** — Dynamic loading of product data and reusable components

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

## 👤 Author

**Amr Elmaghraby**

---

<p align="center">
  Made with ❤️ for fashion lovers
</p>
