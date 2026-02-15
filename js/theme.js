/**
 * Theme Manager - Handles dark/light mode toggle and persistence
 * Uses localStorage to save user preference
 */

// Theme configuration
const THEME_KEY = "fashion-store-theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

/**
 * Initialize theme on page load
 * Checks localStorage for saved preference or defaults to light mode
 */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY) || LIGHT_THEME;
  applyTheme(savedTheme);
  updateThemeToggleIcon(savedTheme);

  const themeToggleBtn = document.getElementById("theme-toggle");
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", toggleTheme);
  }
}

/**
 * Apply the specified theme to the document
 * @param {string} theme - 'dark' or 'light'
 */
function applyTheme(theme) {
  const html = document.documentElement;

  if (theme === DARK_THEME) {
    html.classList.add("dark");
  } else {
    html.classList.remove("dark");
  }

  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Toggle between dark and light themes
 */
function toggleTheme() {
  const currentTheme = localStorage.getItem(THEME_KEY) || LIGHT_THEME;
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

  applyTheme(newTheme);
  updateThemeToggleIcon(newTheme);
}

/**
 * Update the theme toggle button icon based on current theme
 * @param {string} theme - 'dark' or 'light'
 */
function updateThemeToggleIcon(theme) {
  const themeToggleBtn = document.getElementById("theme-toggle");
  if (!themeToggleBtn) return;

  const sunIcon = themeToggleBtn.querySelector(".sun-icon");
  const moonIcon = themeToggleBtn.querySelector(".moon-icon");

  if (theme === DARK_THEME) {
    if (sunIcon) sunIcon.classList.remove("hidden");
    if (moonIcon) moonIcon.classList.add("hidden");
  } else {
    if (sunIcon) sunIcon.classList.add("hidden");
    if (moonIcon) moonIcon.classList.remove("hidden");
  }
}

/**
 * Get the current theme
 * @returns {string} 'dark' or 'light'
 */
function getCurrentTheme() {
  return localStorage.getItem(THEME_KEY) || LIGHT_THEME;
}

/**
 * Check if dark mode is currently active
 * @returns {boolean}
 */
function isDarkMode() {
  return getCurrentTheme() === DARK_THEME;
}

// Initialize theme when DOM is ready
document.addEventListener("DOMContentLoaded", initTheme);

// Re-initialize when header component is dynamically loaded
document.addEventListener("componentLoaded", (e) => {
  if (e.detail && e.detail.id === "header") {
    initTheme();
  }
});
