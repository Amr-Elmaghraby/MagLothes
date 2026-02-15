/**
 * Authentication Manager - Handles user registration, login, and session management
 * Uses localStorage for persistent user data and sessionStorage for active session
 */

// Storage keys
const USERS_KEY = "fashion-store-users";
const SESSION_KEY = "fashion-store-session";

/**
 * Initialize authentication on page load
 * Updates UI based on login state
 */
function initAuth() {
  updateAuthUI();

  // Add event listeners for auth forms if they exist
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const logoutBtn = document.getElementById("logout-btn");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  if (registerForm) {
    registerForm.addEventListener("submit", handleRegister);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", handleLogout);
  }

  const mobileLogoutBtn = document.getElementById("mobile-logout-btn");
  if (mobileLogoutBtn) {
    mobileLogoutBtn.addEventListener("click", handleLogout);
  }
}

/**
 * Get all registered users from localStorage
 * @returns {Array} Array of user objects
 */
function getUsers() {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
}

/**
 * Save users array to localStorage
 * @param {Array} users - Array of user objects
 */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

/**
 * Get current session from sessionStorage
 * @returns {Object|null} Current session object or null
 */
function getSession() {
  const session = sessionStorage.getItem(SESSION_KEY);
  return session ? JSON.parse(session) : null;
}

/**
 * Save session to sessionStorage
 * @param {Object} session - Session object with user data
 */
function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Clear current session (logout)
 */
function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

/**
 * Check if user is currently logged in
 * @returns {boolean}
 */
function isLoggedIn() {
  return getSession() !== null;
}

/**
 * Get current logged in user
 * @returns {Object|null} User object or null
 */
function getCurrentUser() {
  const session = getSession();
  if (!session) return null;

  const users = getUsers();
  return users.find((user) => user.email === session.email) || null;
}

/**
 * Handle user registration
 * @param {Event} e - Form submit event
 */
function handleRegister(e) {
  e.preventDefault();

  const nameInput = document.getElementById("reg-name");
  const emailInput = document.getElementById("reg-email");
  const passwordInput = document.getElementById("reg-password");
  const confirmPasswordInput = document.getElementById("reg-confirm-password");
  const errorElement = document.getElementById("register-error");

  const name = nameInput?.value.trim();
  const email = emailInput?.value.trim().toLowerCase();
  const password = passwordInput?.value;
  const confirmPassword = confirmPasswordInput?.value;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    showAuthError(errorElement, "Please fill in all fields");
    return;
  }

  if (password !== confirmPassword) {
    showAuthError(errorElement, "Passwords do not match");
    return;
  }

  // Password complexity check
  // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  if (!passwordRegex.test(password)) {
    showAuthError(
      errorElement,
      "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.",
    );
    return;
  }

  // Check if email already exists
  const users = getUsers();
  if (users.some((user) => user.email === email)) {
    showAuthError(errorElement, "Email already registered");
    return;
  }

  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // In a real app, this should be hashed!
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-login after registration
  const session = {
    email: newUser.email,
    name: newUser.name,
    loginTime: new Date().toISOString(),
  };
  saveSession(session);

  // Redirect to home or intended page
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect") || "../index.html";
  window.location.href = redirect;
}

/**
 * Handle user login
 * @param {Event} e - Form submit event
 */
function handleLogin(e) {
  e.preventDefault();

  const emailInput = document.getElementById("login-email");
  const passwordInput = document.getElementById("login-password");
  const errorElement = document.getElementById("login-error");

  const email = emailInput?.value.trim().toLowerCase();
  const password = passwordInput?.value;

  // Validation
  if (!email || !password) {
    showAuthError(errorElement, "Please enter email and password");
    return;
  }

  // Find user
  const users = getUsers();
  const user = users.find((u) => u.email === email);

  if (!user || user.password !== password) {
    showAuthError(errorElement, "Invalid email or password");
    return;
  }

  // Create session
  const session = {
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString(),
  };
  saveSession(session);

  // Redirect to home or intended page
  const urlParams = new URLSearchParams(window.location.search);
  const redirect = urlParams.get("redirect") || "../index.html";
  window.location.href = redirect;
}

/**
 * Handle user logout
 */
function handleLogout() {
  clearSession();
  window.location.href = "../index.html";
}

/**
 * Display authentication error message
 * @param {HTMLElement} element - Error display element
 * @param {string} message - Error message
 */
function showAuthError(element, message) {
  if (element) {
    element.textContent = message;
    element.classList.remove("hidden");

    // Auto-hide after 5 seconds
    setTimeout(() => {
      element.classList.add("hidden");
    }, 5000);
  }
}

/**
 * Update UI elements based on authentication state
 * Shows/hides login/logout buttons and user name
 */
function updateAuthUI() {
  const session = getSession();

  // Elements to show/hide based on login state
  const loggedInElements = document.querySelectorAll(".logged-in-only");
  const loggedOutElements = document.querySelectorAll(".logged-out-only");
  const userNameElements = document.querySelectorAll(".user-name");
  console.log(loggedInElements);
  console.log(loggedOutElements);
  console.log(userNameElements);
  
  
  if (session) {
    // User is logged in
    loggedInElements.forEach((el) => el.classList.remove("hidden"));
    loggedOutElements.forEach((el) => el.classList.add("hidden"));
    userNameElements.forEach((el) => (el.textContent = session.name));
  } else {
    // User is logged out
    loggedInElements.forEach((el) => el.classList.add("hidden"));
    loggedOutElements.forEach((el) => el.classList.remove("hidden"));
  }
}

/**
 * Protect a page - redirect to login if not authenticated
 * Use this on cart and checkout pages
 */
function requireAuth() {
  if (!isLoggedIn()) {
    const currentPage = encodeURIComponent(window.location.pathname);
    window.location.href = `login.html?redirect=${currentPage}`;
    return false;
  }
  return true;
}

// Initialize auth when DOM is ready
document.addEventListener("DOMContentLoaded", initAuth);

// Re-initialize when header component is dynamically loaded
document.addEventListener("componentLoaded", (e) => {
  if (e.detail && e.detail.id === "header") {
    initAuth();
  }
});
