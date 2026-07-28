/* ==========================================================================
   Beauty Design Intelligent Platform - Core Application Logic
   ========================================================================== */

const state = {
  currentPage: "home",
  selectedProductId: null,
  activeCategory: "All",
  sortBy: "default",
  searchQuery: "",
  cart: [],
  currentUser: null,
  adminActiveTab: "inventory",
  checkoutRedirect: false // Tracks if user was redirected to login from checkout
};

// --- Initialization ---
document.addEventListener("DOMContentLoaded", () => {
  initAppState();
  setupGlobalEventListeners();
  handleRouting();
});

function initAppState() {
  // Load Cart
  const savedCart = localStorage.getItem("bd_cart");
  if (savedCart) {
    state.cart = JSON.parse(savedCart);
  }
  updateCartUI();

  // Load Session User
  const sessionUser = sessionStorage.getItem("bd_current_user");
  if (sessionUser) {
    state.currentUser = JSON.parse(sessionUser);
  }
  updateHeaderAuthStatus();
}

// --- Router / View Controller ---
window.addEventListener("hashchange", handleRouting);

function handleRouting() {
  const hash = window.location.hash || "#home";
  const appRoot = document.getElementById("app-root");
  
  // Clean active header states
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));

  // Check routes
  if (hash === "#home" || hash.startsWith("#home")) {
    state.currentPage = "home";
    renderHomeView(appRoot);
    setActiveNavLink("home");
  } 
  else if (hash.startsWith("#product-details:")) {
    state.currentPage = "product-details";
    const prodId = hash.split(":")[1];
    state.selectedProductId = prodId;
    renderProductDetailsView(appRoot, prodId);
  } 
  else if (hash === "#login") {
    if (state.currentUser) {
      window.location.hash = "#home";
      return;
    }
    state.currentPage = "login";
    renderLoginView(appRoot);
  } 
  else if (hash === "#register") {
    if (state.currentUser) {
      window.location.hash = "#home";
      return;
    }
    state.currentPage = "register";
    renderRegisterView(appRoot);
  } 
  else if (hash === "#checkout") {
    // Auth Guard for Checkout
    if (!state.currentUser) {
      state.checkoutRedirect = true;
      showToast("Please sign in or create an account to proceed to checkout.", "danger");
      window.location.hash = "#login";
      return;
    }
    // Cart Guard
    if (state.cart.length === 0) {
      showToast("Your cart is empty. Browse products first!", "danger");
      window.location.hash = "#home";
      return;
    }
    state.currentPage = "checkout";
    renderCheckoutView(appRoot);
  } 
  else if (hash === "#admin") {
    // Admin Role Guard
    if (!state.currentUser || state.currentUser.role !== "admin") {
      showToast("Access denied. Authorized personnel only.", "danger");
      window.location.hash = "#home";
      return;
    }
    state.currentPage = "admin";
    renderAdminView(appRoot);
    setActiveNavLink("admin");
  } 
  else if (hash === "#about") {
    state.currentPage = "about";
    renderAboutView(appRoot);
    setActiveNavLink("about");
  } 
  else if (hash === "#contact") {
    state.currentPage = "contact";
    renderContactView(appRoot);
    setActiveNavLink("contact");
  } 
  else {
    // Fallback
    window.location.hash = "#home";
  }

  // Scroll to top on page navigate
  window.scrollTo(0, 0);
}

function setActiveNavLink(pageName) {
  const activeLink = document.querySelector(`.nav-link[data-page="${pageName}"]`);
  if (activeLink) activeLink.classList.add("active");
}

// --- Render Functions ---

function renderHomeView(container) {
  const products = db.getProducts();
  container.innerHTML = components.home(products, state.activeCategory, state.sortBy, state.searchQuery);
  setupHomeEventListeners();
}

function renderProductDetailsView(container, id) {
  const product = db.getProductById(id);
  if (!product) {
    container.innerHTML = `
      <div class="container section-padding text-center">
        <h2>Product Not Found</h2>
        <p>The beauty item you are looking for does not exist or has been removed.</p>
        <a href="#home" class="btn-shop-now">Back to Catalog</a>
      </div>
    `;
    return;
  }
  container.innerHTML = components.productDetails(product);
  setupDetailsEventListeners(product);
}

function renderLoginView(container) {
  container.innerHTML = components.login();
  setupLoginEventListeners();
}

function renderRegisterView(container) {
  container.innerHTML = components.register();
  setupRegisterEventListeners();
}

function renderCheckoutView(container) {
  const settings = db.getSettings();
  const subtotal = getCartSubtotal();
  container.innerHTML = components.checkout(state.cart, subtotal, settings);
  setupCheckoutEventListeners();
}

function renderAdminView(container) {
  const products = db.getProducts();
  const orders = db.getOrders();
  const settings = db.getSettings();
  container.innerHTML = components.adminDashboard(products, orders, state.adminActiveTab, settings);
  setupAdminEventListeners();
}

function renderAboutView(container) {
  container.innerHTML = components.about();
}

function renderContactView(container) {
  container.innerHTML = components.contact();
}

// --- Home Event Listeners ---
function setupHomeEventListeners() {
  // Category Filtering
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.activeCategory = e.target.getAttribute("data-category");
      renderHomeView(document.getElementById("app-root"));
      // Smooth scroll to catalog anchor
      const catalog = document.getElementById("shop-catalog-anchor");
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Sorting
  const sortSelect = document.getElementById("sort-products");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      state.sortBy = e.target.value;
      renderHomeView(document.getElementById("app-root"));
    });
  }

  // Quick View Button
  document.querySelectorAll(".btn-quick-view").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      window.location.hash = `#product-details:${id}`;
    });
  });

  // Add to Bag Button from Grid
  document.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-id");
      addToCart(id, 1);
    });
  });

  // Hero Shop CTA
  const heroCta = document.getElementById("btn-hero-shop");
  if (heroCta) {
    heroCta.addEventListener("click", (e) => {
      e.preventDefault();
      const catalog = document.getElementById("shop-catalog-anchor");
      if (catalog) catalog.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// --- Product Details Event Listeners ---
function setupDetailsEventListeners(product) {
  let selectedQty = 1;
  const qtyVal = document.getElementById("details-qty-count");
  const decBtn = document.getElementById("btn-details-qty-dec");
  const incBtn = document.getElementById("btn-details-qty-inc");
  const addBtn = document.getElementById("btn-details-add-cart");

  if (decBtn && incBtn && qtyVal) {
    decBtn.addEventListener("click", () => {
      if (selectedQty > 1) {
        selectedQty--;
        qtyVal.textContent = selectedQty;
      }
    });

    incBtn.addEventListener("click", () => {
      const max = parseInt(incBtn.getAttribute("data-max")) || 1;
      if (selectedQty < max) {
        selectedQty++;
        qtyVal.textContent = selectedQty;
      } else {
        showToast(`Cannot order more than available stock (${max}).`, "danger");
      }
    });
  }

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      addToCart(product.id, selectedQty);
    });
  }
}

// --- Authentication Event Listeners ---
function setupLoginEventListeners() {
  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("login-email").value;
      const pass = document.getElementById("login-password").value;

      const user = db.getUserByEmail(email);
      if (user && user.password === pass) {
        // Authenticated!
        state.currentUser = user;
        sessionStorage.setItem("bd_current_user", JSON.stringify(user));
        
        updateHeaderAuthStatus();
        showToast(`Welcome back, ${user.name}!`, "success");

        // Redirect flow
        if (state.checkoutRedirect) {
          state.checkoutRedirect = false;
          window.location.hash = "#checkout";
        } else if (user.role === "admin") {
          window.location.hash = "#admin";
        } else {
          window.location.hash = "#home";
        }
      } else {
        showToast("Invalid email or password combination.", "danger");
      }
    });
  }
}

function setupRegisterEventListeners() {
  const form = document.getElementById("register-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const pass = document.getElementById("register-password").value;

      const result = db.registerUser(name, email, pass);
      if (result.success) {
        // Login newly created user
        state.currentUser = result.user;
        sessionStorage.setItem("bd_current_user", JSON.stringify(result.user));

        updateHeaderAuthStatus();
        showToast(`Account created. Welcome to the Yaska beauty products, ${name}!`, "success");

        if (state.checkoutRedirect) {
          state.checkoutRedirect = false;
          window.location.hash = "#checkout";
        } else {
          window.location.hash = "#home";
        }
      } else {
        showToast(result.message, "danger");
      }
    });
  }
}

// --- Checkout Event Listeners ---
function setupCheckoutEventListeners() {
  const form = document.getElementById("checkout-form");
  if (form) {
    // Populate form with current user's name
    if (state.currentUser) {
      document.getElementById("co-name").value = state.currentUser.name;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const receiverName = document.getElementById("co-name").value;
      const phone = document.getElementById("co-phone").value;
      const address = document.getElementById("co-address").value;
      const city = document.getElementById("co-city").value;
      const zip = document.getElementById("co-zip").value;
      const mpesaCode = document.getElementById("co-mpesa-code").value.toUpperCase().trim();
      const mpesaPhone = document.getElementById("co-mpesa-phone").value;

      // Validate M-PESA Code structure
      if (mpesaCode.length !== 10) {
        showToast("M-PESA transaction code must be exactly 10 characters long.", "danger");
        return;
      }

      const orderData = {
        customerEmail: state.currentUser.email,
        customerName: state.currentUser.name,
        shippingDetails: { receiverName, phone, address, city, zip },
        paymentDetails: { mpesaCode, mpesaPhone },
        items: state.cart.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          price: item.price
        })),
        total: getCartSubtotal() + (getCartSubtotal() > 10000 ? 0 : 350)
      };

      // Place Order in DB
      const placedOrder = db.createOrder(orderData);
      
      // Clear Cart
      state.cart = [];
      localStorage.removeItem("bd_cart");
      updateCartUI();

      // Notify User
      showToast(`Order ${placedOrder.orderId} submitted and payment verified successfully!`, "success");
      
      // Confirmation page or redirect
      alert(`Order placed successfully!\n\nOrder ID: ${placedOrder.orderId}\nTotal Amount: Ksh ${placedOrder.total.toLocaleString()}\n\nThank you for shopping at Beauty Design Intelligent Platform.`);
      
      window.location.hash = "#home";
    });
  }
}

// --- Admin Panel Event Listeners ---
function setupAdminEventListeners() {
  // Sidebar Tabs
  document.querySelectorAll(".admin-tab-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      state.adminActiveTab = btn.getAttribute("data-tab");
      renderAdminView(document.getElementById("app-root"));
    });
  });

  // Open Modal - Add Product
  const addBtn = document.getElementById("btn-open-add-product");
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      openProductModal();
    });
  }

  // Edit Product Button
  document.querySelectorAll(".btn-table-edit").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const prod = db.getProductById(id);
      if (prod) {
        openProductModal(prod);
      }
    });
  });

  // Delete Product Button
  document.querySelectorAll(".btn-table-delete").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      const prod = db.getProductById(id);
      if (prod && confirm(`Are you sure you want to remove "${prod.name}" from inventory?`)) {
        db.deleteProduct(id);
        renderAdminView(document.getElementById("app-root"));
        showToast("Product deleted successfully.", "success");
      }
    });
  });

  // Close Modal triggers
  const closeModalBtn = document.getElementById("btn-close-modal");
  const cancelModalBtn = document.getElementById("btn-cancel-modal");
  if (closeModalBtn) closeModalBtn.addEventListener("click", closeProductModal);
  if (cancelModalBtn) cancelModalBtn.addEventListener("click", closeProductModal);

  // Modal CRUD Form Submit
  const crudForm = document.getElementById("product-crud-form");
  if (crudForm) {
    crudForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const id = document.getElementById("crud-product-id").value;
      const name = document.getElementById("crud-name").value;
      const category = document.getElementById("crud-category").value;
      const price = parseFloat(document.getElementById("crud-price").value);
      const stock = parseInt(document.getElementById("crud-stock").value);
      const imageUrl = document.getElementById("crud-image").value;
      const description = document.getElementById("crud-desc").value;

      const productPayload = { name, category, price, stock, imageUrl, description };

      if (id) {
        // Edit Mode
        db.updateProduct({ id, ...productPayload });
        showToast("Product updated successfully.", "success");
      } else {
        // Add Mode
        db.addProduct(productPayload);
        showToast("Product added to inventory.", "success");
      }

      closeProductModal();
      renderAdminView(document.getElementById("app-root"));
    });
  }

  // Settings Save Form Submit
  const settingsForm = document.getElementById("admin-settings-form");
  if (settingsForm) {
    settingsForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const paybillNumber = document.getElementById("setting-paybill").value;
      const accountName = document.getElementById("setting-account").value.toUpperCase().trim();

      db.saveSettings({ paybillNumber, accountName });
      showToast("Payment configurations updated successfully.", "success");
      
      renderAdminView(document.getElementById("app-root"));
    });
  }
}

// Modal helper controls
function openProductModal(product = null) {
  const backdrop = document.getElementById("product-modal-backdrop");
  const title = document.getElementById("modal-title-text");
  
  // Clear form
  document.getElementById("product-crud-form").reset();
  document.getElementById("crud-product-id").value = "";

  if (product) {
    title.textContent = "Edit Product Formulations";
    document.getElementById("crud-product-id").value = product.id;
    document.getElementById("crud-name").value = product.name;
    document.getElementById("crud-category").value = product.category;
    document.getElementById("crud-price").value = product.price;
    document.getElementById("crud-stock").value = product.stock;
    document.getElementById("crud-image").value = product.imageUrl;
    document.getElementById("crud-desc").value = product.description;
  } else {
    title.textContent = "Add New Beauty Product";
  }

  backdrop.classList.add("active");
}

function closeProductModal() {
  document.getElementById("product-modal-backdrop").classList.remove("active");
}


// --- Cart Core Functions ---
function addToCart(id, qty = 1) {
  const product = db.getProductById(id);
  if (!product) return;

  if (product.stock === 0) {
    showToast("This item is out of stock.", "danger");
    return;
  }

  const existingItemIndex = state.cart.findIndex(item => item.id === id);

  if (existingItemIndex !== -1) {
    const newQty = state.cart[existingItemIndex].qty + qty;
    if (newQty > product.stock) {
      showToast(`Cannot add more. Only ${product.stock} units available.`, "danger");
      return;
    }
    state.cart[existingItemIndex].qty = newQty;
  } else {
    if (qty > product.stock) {
      showToast(`Only ${product.stock} units available.`, "danger");
      return;
    }
    state.cart.push({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      imageUrl: product.imageUrl,
      qty: qty
    });
  }

  // Persist
  localStorage.setItem("bd_cart", JSON.stringify(state.cart));
  updateCartUI();
  
  // Feedback
  showToast(`"${product.name}" added to bag.`, "success");
  
  // Auto open cart
  openCartDrawer();
}

function updateCartQty(id, newQty) {
  const product = db.getProductById(id);
  const cartItem = state.cart.find(item => item.id === id);
  if (!product || !cartItem) return;

  if (newQty <= 0) {
    removeFromCart(id);
    return;
  }

  if (newQty > product.stock) {
    showToast(`Only ${product.stock} items in stock.`, "danger");
    return;
  }

  cartItem.qty = newQty;
  localStorage.setItem("bd_cart", JSON.stringify(state.cart));
  updateCartUI();
}

function removeFromCart(id) {
  state.cart = state.cart.filter(item => item.id !== id);
  localStorage.setItem("bd_cart", JSON.stringify(state.cart));
  updateCartUI();
  showToast("Item removed from your bag.", "success");
}

function getCartSubtotal() {
  return state.cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function getCartItemsCount() {
  return state.cart.reduce((count, item) => count + item.qty, 0);
}

function updateCartUI() {
  // Update badge in header
  const count = getCartItemsCount();
  document.getElementById("cart-badge-count").textContent = count;

  // Render items list inside the drawer
  const container = document.getElementById("cart-drawer-items");
  const footer = document.getElementById("cart-drawer-footer");
  
  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-feather-pointed"></i>
        <p>Your bag is currently empty.</p>
        <a href="#home" class="btn-shop-now" id="btn-empty-shop">Explore Products</a>
      </div>
    `;
    footer.style.display = "none";
  } else {
    footer.style.display = "block";
    document.getElementById("cart-subtotal-amount").textContent = `Ksh ${getCartSubtotal().toLocaleString()}`;

    container.innerHTML = state.cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.imageUrl}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p class="cart-item-category">${item.category}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="cart-item-price">Ksh ${item.price.toLocaleString()}</span>
            <div class="cart-item-qty">
              <button class="qty-btn btn-qty-dec" data-id="${item.id}">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn btn-qty-inc" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
        <button class="btn-remove-item" data-id="${item.id}" title="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>
    `).join('');

    // Setup Cart Items event listeners
    container.querySelectorAll(".btn-qty-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = state.cart.find(i => i.id === id);
        if (item) updateCartQty(id, item.qty - 1);
      });
    });

    container.querySelectorAll(".btn-qty-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const item = state.cart.find(i => i.id === id);
        if (item) updateCartQty(id, item.qty + 1);
      });
    });

    container.querySelectorAll(".btn-remove-item").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        removeFromCart(id);
      });
    });
  }

  // Update checkout view totals if we're on checkout screen
  if (state.currentPage === "checkout") {
    const appRoot = document.getElementById("app-root");
    renderCheckoutView(appRoot);
  }
}

// --- Global UI Listeners (Header, Cart Drawer, Search) ---
function setupGlobalEventListeners() {
  const cartBtn = document.getElementById("cart-trigger");
  const closeCartBtn = document.getElementById("btn-close-cart");
  const overlay = document.getElementById("cart-drawer-overlay");

  if (cartBtn) cartBtn.addEventListener("click", openCartDrawer);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);
  if (overlay) overlay.addEventListener("click", closeCartDrawer);

  // Checkout redirect from cart drawer
  const checkoutBtn = document.getElementById("btn-proceed-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      closeCartDrawer();
      window.location.hash = "#checkout";
    });
  }

  // Global search input listeners
  const searchInput = document.getElementById("global-search");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      if (state.currentPage === "home") {
        renderHomeView(document.getElementById("app-root"));
      } else {
        // Redirect to shop home page
        window.location.hash = "#home";
      }
    });
  }

  // Bind direct links inside footer lists
  document.querySelectorAll(".footer-links a[data-filter]").forEach(link => {
    link.addEventListener("click", (e) => {
      state.activeCategory = link.getAttribute("data-filter");
      state.searchQuery = "";
      if (searchInput) searchInput.value = "";
      // Handled by hash routing naturally, but force rendering to apply filters
      window.location.hash = "#home";
      renderHomeView(document.getElementById("app-root"));
    });
  });

  // Logo Link override to clear filters
  const logoLink = document.getElementById("logo-link");
  if (logoLink) {
    logoLink.addEventListener("click", () => {
      state.activeCategory = "All";
      state.searchQuery = "";
      state.sortBy = "default";
      if (searchInput) searchInput.value = "";
    });
  }
}

function openCartDrawer() {
  document.getElementById("cart-drawer").classList.add("active");
  document.getElementById("cart-drawer-overlay").classList.add("active");
}

function closeCartDrawer() {
  document.getElementById("cart-drawer").classList.remove("active");
  document.getElementById("cart-drawer-overlay").classList.remove("active");
}

// --- Header Auth display ---
function updateHeaderAuthStatus() {
  const container = document.getElementById("auth-status-container");
  const adminNavItem = document.getElementById("admin-nav-item");

  if (state.currentUser) {
    // Logged In
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 0.85rem; font-weight:600; color: var(--text-secondary);">
          <i class="fa-solid fa-circle-user" style="margin-right: 4px; color: var(--color-gold);"></i> ${state.currentUser.name}
        </span>
        <button id="btn-logout" class="btn-auth" style="padding: 0.3rem 0.8rem; font-size: 0.8rem; background: var(--bg-secondary); border-radius: 4px;">
          <i class="fa-solid fa-right-from-bracket"></i> Sign Out
        </button>
      </div>
    `;

    // Bind logout button
    document.getElementById("btn-logout").addEventListener("click", logoutUser);

    // Show Admin Link if user is Admin
    if (state.currentUser.role === "admin") {
      adminNavItem.classList.remove("hidden");
    } else {
      adminNavItem.classList.add("hidden");
    }
  } else {
    // Logged Out
    container.innerHTML = `
      <a href="#login" class="btn-auth" id="btn-login-redirect">
        <i class="fa-regular fa-user"></i> <span>Sign In</span>
      </a>
    `;
    adminNavItem.classList.add("hidden");
  }
}

function logoutUser() {
  state.currentUser = null;
  sessionStorage.removeItem("bd_current_user");
  updateHeaderAuthStatus();
  showToast("Logged out successfully.", "success");
  window.location.hash = "#home";
}

// --- Toast Utilities ---
function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  
  const icon = type === "success" 
    ? '<i class="fa-solid fa-circle-check" style="color: var(--success);"></i>'
    : '<i class="fa-solid fa-circle-exclamation" style="color: var(--danger);"></i>';

  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // Auto remove toast
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}
