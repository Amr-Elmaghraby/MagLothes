/**
 * Components Loader
 * Handles dynamic loading of shared header and footer components.
 *
 * After each component is injected, it dispatches a custom event
 * so that other scripts (theme, auth, cart) can re-initialize
 * the elements that now exist in the DOM.
 */

/**
 * Load a component into a placeholder element
 * @param {string} elementId - ID of the placeholder element
 * @param {string} componentPath - Path to the component HTML file
 * @param {string} basePath - Base path for resolving relative links (default: './')
 * @returns {Promise<void>}
 */
async function loadComponent(elementId, componentPath, basePath = "./") {
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load component: ${componentPath}`);
    }
    let html = await response.text();

    // Fix relative paths based on basePath
    html = html.replace(/src="\.\//g, `src="${basePath}`);
    html = html.replace(/src="pages\//g, `src="${basePath}pages/`);
    html = html.replace(/src="index\.html"/g, `src="${basePath}index.html"`);
    html = html.replace(/href="\.\//g, `href="${basePath}`);
    html = html.replace(/href="pages\//g, `href="${basePath}pages/`);
    html = html.replace(/href="index\.html"/g, `href="${basePath}index.html"`);

    const container = document.getElementById(elementId);
    if (container) {
      container.innerHTML = html;
      if(elementId === "header"){
        highlightActivePage(container);
      }

      // Dispatch a custom event so other scripts can re-initialize
      document.dispatchEvent(
        new CustomEvent("componentLoaded", { detail: { id: elementId } }),
      );
    }
  } catch (error) {
    console.error("Error loading component:", error);
  }
}

function highlightActivePage(container) {
  const currentPath = window.location.pathname;
  const navLinks = container.querySelectorAll(".page");
  console.log(currentPath);

  navLinks.forEach((link) => {
    let linkPath = link.getAttribute("href");
    if (linkPath.endsWith(currentPath)) {
      console.log("here");
      link.classList.add("text-zinc-900", "text-indigo-500","font-bold","text-lg","dark:text-indigo-500");
      link.classList.remove("text-zinc-600", "text-zinc-400","font-mid","text-md");
    }
    else{
      link.classList.add("text-zinc-600", "text-zinc-400","font-mid","text-md");
      link.classList.remove("text-zinc-900", "text-indigo-500","font-bold","text-lg");
    }
  });
}

// Expose globally so inline scripts and modules can call it
window.loadComponent = loadComponent;
