/* ==========================================================================
   Beauty Design Intelligent Platform - HTML Components Renderer
   ========================================================================== */

const components = {
  
  // 1. Home / Shop View
  home: (products, activeCategory = 'All', sortBy = 'default', searchQuery = '') => {
    // Filter by category
    let filtered = activeCategory === 'All' 
      ? products 
      : products.filter(p => p.category === activeCategory);

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    const categories = ['All', 'Skincare', 'Cosmetics', 'Haircare', 'Fragrance'];

    const categoryButtons = categories.map(cat => `
      <button class="category-btn ${activeCategory === cat ? 'active' : ''}" data-category="${cat}">
        ${cat}
      </button>
    `).join('');

    const productCards = filtered.length > 0 ? filtered.map(p => {
      const isOutOfStock = p.stock === 0;
      const isLowStock = p.stock > 0 && p.stock <= 5;
      
      return `
        <article class="product-card" data-id="${p.id}">
          ${isOutOfStock ? `<span class="product-badge out-of-stock">Out of Stock</span>` : ''}
          ${!isOutOfStock && isLowStock ? `<span class="product-badge">Only ${p.stock} left</span>` : ''}
          
          <div class="product-card-img-container">
            <img class="product-card-img" src="${p.imageUrl}" alt="${p.name}" loading="lazy">
            <div class="product-card-overlay">
              <button class="btn-card-action btn-quick-view" data-id="${p.id}" title="Quick View">
                <i class="fa-regular fa-eye"></i>
              </button>
              ${!isOutOfStock ? `
                <button class="btn-card-action btn-add-cart" data-id="${p.id}" title="Add to Bag">
                  <i class="fa-solid fa-bag-shopping"></i>
                </button>
              ` : ''}
            </div>
          </div>
          
          <div class="product-card-content">
            <span class="product-card-category">${p.category}</span>
            <h3 class="product-card-title">${p.name}</h3>
            
            <div class="product-card-rating">
              <span class="stars">${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(p.rating))}${p.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}</span>
              <span>(${p.reviewsCount})</span>
            </div>
            
            <div class="product-card-price-row">
              <span class="product-card-price">Ksh ${p.price.toLocaleString()}</span>
              <span class="product-card-stock ${isOutOfStock ? 'stock-out' : 'stock-in'}">
                ${isOutOfStock ? 'Sold Out' : 'Available'}
              </span>
            </div>
          </div>
        </article>
      `;
    }).join('') : `
      <div style="grid-column: 1/-1; padding: 4rem 0;" class="text-center">
        <i class="fa-solid fa-feather-pointed" style="font-size: 3rem; color: var(--color-gold-light); margin-bottom: 1rem;"></i>
        <h3>No Products Found</h3>
        <p style="color: var(--text-secondary); margin-top: 0.5rem;">Try adjusting your filters or search keywords.</p>
      </div>
    `;

    return `
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-grid">
          <div class="hero-content">
            <h1>Elevate Your Daily Rituals with <span>Intelligent Beauty</span></h1>
            <p class="hero-description">Discover a tailored collection of clinical skincare, clean organic botanicals, and high-fashion cosmetics designed to bring out your natural skin architecture.</p>
            <a href="#home" class="hero-cta" id="btn-hero-shop">Explore Collection <i class="fa-solid fa-arrow-right"></i></a>
          </div>
          <div class="hero-visual">
            <div class="hero-image-frame">
              <img src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80" alt="Beauty Design Skincare Selection">
            </div>
          </div>
        </div>
      </section>

      <!-- Shop Section -->
      <section class="container section-padding" id="shop-catalog-anchor">
        <div class="text-center" style="margin-bottom: 2rem;">
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 400;">The Beauty Edit</h2>
          <p style="color: var(--text-secondary); font-size: 0.95rem; max-width: 500px; margin: 0.5rem auto 0 auto;">Selectively formulated and tested to bring out your ultimate radiance.</p>
        </div>

        <!-- Filter & Sort Bar -->
        <div class="filter-bar">
          <div class="categories-container">
            ${categoryButtons}
          </div>
          
          <div class="sort-select-wrapper">
            <span>Sort By</span>
            <select class="sort-select" id="sort-products">
              <option value="default" ${sortBy === 'default' ? 'selected' : ''}>Featured</option>
              <option value="price-low" ${sortBy === 'price-low' ? 'selected' : ''}>Price: Low to High</option>
              <option value="price-high" ${sortBy === 'price-high' ? 'selected' : ''}>Price: High to Low</option>
              <option value="rating" ${sortBy === 'rating' ? 'selected' : ''}>Top Rated</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="product-grid" id="product-list-container">
          ${productCards}
        </div>
      </section>
    `;
  },

  // 2. Product Details View
  productDetails: (product) => {
    const isOutOfStock = product.stock === 0;
    
    return `
      <section class="container section-padding details-section">
        <a href="#home" class="btn-back-shop"><i class="fa-solid fa-arrow-left"></i> Back to Collection</a>
        
        <div class="details-grid">
          <!-- Gallery -->
          <div class="details-gallery">
            <div class="details-image-frame">
              <img src="${product.imageUrl}" alt="${product.name}">
            </div>
          </div>
          
          <!-- Details Info -->
          <div class="details-info">
            <span class="details-category">${product.category}</span>
            <h1 class="details-title">${product.name}</h1>
            
            <div class="details-rating-row">
              <div class="details-stars">
                ${'<i class="fa-solid fa-star"></i>'.repeat(Math.floor(product.rating))}${product.rating % 1 !== 0 ? '<i class="fa-solid fa-star-half-stroke"></i>' : ''}
              </div>
              <span class="details-reviews-count">${product.rating} rating &bull; ${product.reviewsCount} customer reviews</span>
            </div>
            
            <div class="details-price">Ksh ${product.price.toLocaleString()}</div>
            
            <p class="details-description">${product.description}</p>
            
            <div class="details-meta-list">
              <div class="details-meta-item">
                <span class="details-meta-label">Availability</span>
                <span class="details-meta-value" style="font-weight: 600; color: ${isOutOfStock ? 'var(--danger)' : 'var(--success)'}">
                  ${isOutOfStock ? 'Temporarily Out of Stock' : `In Stock (Only ${product.stock} units left)`}
                </span>
              </div>
              <div class="details-meta-item">
                <span class="details-meta-label">Category</span>
                <span class="details-meta-value">${product.category} Collection</span>
              </div>
              <div class="details-meta-item">
                <span class="details-meta-label">Shipping</span>
                <span class="details-meta-value">Standard Dispatch (2-3 business days)</span>
              </div>
            </div>
            
            <div class="details-actions">
              ${!isOutOfStock ? `
                <div class="details-qty-selector">
                  <button class="details-qty-btn" id="btn-details-qty-dec"><i class="fa-solid fa-minus"></i></button>
                  <span class="details-qty-val" id="details-qty-count">1</span>
                  <button class="details-qty-btn" id="btn-details-qty-inc" data-max="${product.stock}"><i class="fa-solid fa-plus"></i></button>
                </div>
                <button class="btn-add-bag" id="btn-details-add-cart" data-id="${product.id}">
                  Add to Bag <i class="fa-solid fa-bag-shopping" style="margin-left: 0.5rem;"></i>
                </button>
              ` : `
                <button class="btn-add-bag" disabled style="background-color: var(--text-muted);">
                  Sold Out
                </button>
              `}
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 3. Login View
  login: () => {
    return `
      <section class="auth-section">
        <div class="auth-container">
          <div class="auth-header">
            <h2>Welcome Back</h2>
            <p>Please enter your credentials to access checkout and profile.</p>
          </div>
          
          <form class="auth-form" id="login-form">
            <div class="form-group">
              <label for="login-email">Email Address</label>
              <input type="email" id="login-email" placeholder="e.g. sarah@example.com" required>
            </div>
            <div class="form-group">
              <label for="login-password">Password</label>
              <input type="password" id="login-password" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="btn-form-submit">Sign In</button>
          </form>
          
          <div class="auth-switch-prompt">
            <p>New to the platform? <a href="#register" id="link-to-register">Create an account</a></p>
          </div>
        </div>
      </section>
    `;
  },

  // 4. Register View (Register is only for users)
  register: () => {
    return `
      <section class="auth-section">
        <div class="auth-container">
          <div class="auth-header">
            <h2>Create Account</h2>
            <p>Join the Beauty Circle for secure checkouts and orders tracking.</p>
          </div>
          
          <form class="auth-form" id="register-form">
            <div class="form-group">
              <label for="register-name">Full Name</label>
              <input type="text" id="register-name" placeholder="e.g. Sarah Jenkins" required>
            </div>
            <div class="form-group">
              <label for="register-email">Email Address</label>
              <input type="email" id="register-email" placeholder="e.g. sarah@example.com" required>
            </div>
            <div class="form-group">
              <label for="register-password">Password</label>
              <input type="password" id="register-password" minlength="4" placeholder="Choose a secure password" required>
            </div>
            <div class="form-group" style="flex-direction: row; gap: 0.5rem; align-items: center; margin-top: 0.5rem;">
              <input type="checkbox" id="terms" required style="width: auto;">
              <label for="terms" style="font-weight: 500; font-size: 0.8rem;">I agree to the Terms of Service & Privacy Policy</label>
            </div>
            <button type="submit" class="btn-form-submit">Register</button>
          </form>
          
          <div class="auth-switch-prompt">
            <p>Already have an account? <a href="#login" id="link-to-login">Sign In</a></p>
          </div>
        </div>
      </section>
    `;
  },

  // 5. Checkout View
  checkout: (cartItems, subtotal, paybillSettings) => {
    const shipping = subtotal > 10000 ? 0 : 350;
    const grandTotal = subtotal + shipping;

    const summaryRows = cartItems.map(item => `
      <div class="checkout-summary-item">
        <img class="checkout-summary-img" src="${item.imageUrl}" alt="${item.name}">
        <div class="checkout-summary-name">
          <p style="font-weight: 600;">${item.name}</p>
          <p style="color: var(--text-muted); font-size: 0.8rem;">Quantity: ${item.qty} &bull; Ksh ${item.price.toLocaleString()}</p>
        </div>
        <div class="checkout-summary-price">Ksh ${(item.price * item.qty).toLocaleString()}</div>
      </div>
    `).join('');

    return `
      <section class="container section-padding checkout-section">
        <h2 style="font-family: var(--font-serif); font-size: 2.2rem; margin-bottom: 2rem;">Secure Checkout</h2>
        
        <div class="checkout-grid">
          <!-- Shipping and Payment Details -->
          <div class="checkout-left">
            
            <form id="checkout-form">
              <!-- Step 1: Shipping Address -->
              <div class="checkout-card">
                <h3><i class="fa-solid fa-truck"></i> 1. Delivery Information</h3>
                
                <div class="form-row-2">
                  <div class="form-group">
                    <label for="co-name">Receiver Full Name</label>
                    <input type="text" id="co-name" placeholder="Sarah Jenkins" required>
                  </div>
                  <div class="form-group">
                    <label for="co-phone">Phone Number (M-PESA)</label>
                    <input type="tel" id="co-phone" placeholder="e.g. 0712345678" required>
                  </div>
                </div>
                
                <div class="form-group" style="margin-top: 1rem;">
                  <label for="co-address">Delivery Address (Street, Building, Apartment)</label>
                  <input type="text" id="co-address" placeholder="e.g. Apt 4B, Rose Apartments, Wood Avenue" required>
                </div>
                
                <div class="form-row-2" style="margin-top: 1rem;">
                  <div class="form-group">
                    <label for="co-city">City</label>
                    <input type="text" id="co-city" placeholder="Nairobi" required>
                  </div>
                  <div class="form-group">
                    <label for="co-zip">Address</label>
                    <input type="text" id="co-zip" placeholder="00100" required>
                  </div>
                </div>
              </div>
              
              <!-- Step 2: Payment (M-PESA instructions) -->
              <div class="checkout-card">
                <h3><i class="fa-solid fa-wallet"></i> 2. M-PESA Payment Details</h3>
                
                <p style="font-size: 0.9rem; color: var(--text-secondary);">
                  Our store processes mobile payments securely via Safaricom M-PESA. Follow the instructions below to complete your checkout:
                </p>
                
                <!-- Dynamic M-PESA Paybill Info Box -->
                <div class="mpesa-details-box">
                  <div class="mpesa-logo-container">
                    <div class="mpesa-title">
                      <i class="fa-solid fa-mobile-screen-button"></i> Lipa na M-PESA
                    </div>
                    <span class="mpesa-badge">Instant Verification</span>
                  </div>
                  
                  <ol class="mpesa-step-list">
                    <li>Open your Safaricom SIM Toolkit or M-PESA App.</li>
                    <li>Go to Lipa na M-PESA, select <span>Paybill</span>.</li>
                    <li>Enter Business Number: <span id="checkout-paybill-display">${paybillSettings.paybillNumber}</span></li>
                    <li>Enter Account Number: <span id="checkout-account-display">${paybillSettings.accountName}</span></li>
                    <li>Enter Amount: <span>Ksh ${grandTotal.toLocaleString()}</span></li>
                    <li>Enter your M-PESA PIN and press Send.</li>
                  </ol>
                </div>

                <div class="form-row-2" style="margin-top: 1.5rem;">
                  <div class="form-group">
                    <label for="co-mpesa-code">M-PESA Transaction Code</label>
                    <input type="text" id="co-mpesa-code" placeholder="e.g. QX728HJ90K" minlength="10" maxlength="10" style="text-transform: uppercase;" required>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">Enter the 10-character code from Safaricom.</span>
                  </div>
                  
                  <div class="form-group">
                    <label for="co-mpesa-phone">Payment M-PESA Phone Number</label>
                    <input type="tel" id="co-mpesa-phone" placeholder="e.g. 0712345678" required>
                    <span style="font-size: 0.75rem; color: var(--text-muted);">The number used to send the payment.</span>
                  </div>
                </div>
              </div>
              
              <button type="submit" class="btn-place-order" id="btn-submit-order">
                Submit Order & Verify Payment <i class="fa-solid fa-lock" style="margin-left: 0.5rem;"></i>
              </button>
            </form>
            
          </div>
          
          <!-- Cart Summary Sidebar -->
          <div class="checkout-right">
            <div class="checkout-card" style="position: sticky; top: 120px;">
              <h3 style="font-family: var(--font-serif);"><i class="fa-solid fa-basket-shopping"></i> Order Summary</h3>
              
              <div class="checkout-summary-list">
                ${summaryRows}
              </div>
              
              <div class="checkout-totals">
                <div class="checkout-totals-row">
                  <span>Cart Subtotal</span>
                  <span>Ksh ${subtotal.toLocaleString()}</span>
                </div>
                <div class="checkout-totals-row">
                  <span>Shipping & Handling</span>
                  <span>${shipping === 0 ? 'FREE' : `Ksh ${shipping.toLocaleString()}`}</span>
                </div>
                <div class="checkout-totals-row grand-total">
                  <span>Total Amount</span>
                  <span>Ksh ${grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  },

  // 6. Admin Dashboard View
  adminDashboard: (products, orders, activeTab = 'inventory', paybillSettings) => {
    // 6.1 Compute metrics
    const totalProducts = products.length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 5).length;
    const totalInventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    const totalRevenue = orders.filter(o => o.status === 'Completed' || o.status === 'Pending').reduce((acc, o) => acc + o.total, 0);

    // Sidebar items
    const tabs = [
      { id: 'inventory', label: 'Inventory Management', icon: 'fa-box-open' },
      { id: 'orders', label: 'Customer Orders', icon: 'fa-receipt' },
      { id: 'settings', label: 'Paybill & Settings', icon: 'fa-gears' }
    ];

    const tabHtml = tabs.map(t => `
      <button class="admin-tab-btn ${activeTab === t.id ? 'active' : ''}" data-tab="${t.id}">
        <i class="fa-solid ${t.icon}"></i> ${t.label}
      </button>
    `).join('');

    // Tab Contents
    let contentHtml = '';

    if (activeTab === 'inventory') {
      const productRows = products.map((p, idx) => {
        let stockBadge = `<span class="badge-stock in">In Stock (${p.stock})</span>`;
        if (p.stock === 0) {
          stockBadge = `<span class="badge-stock out">Out of Stock</span>`;
        } else if (p.stock <= 5) {
          stockBadge = `<span class="badge-stock low">Low Stock (${p.stock})</span>`;
        }

        return `
          <tr>
            <td>${idx + 1}</td>
            <td><img src="${p.imageUrl}" alt="${p.name}" class="admin-table-img"></td>
            <td>
              <div style="font-weight: 600;">${p.name}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${p.category}</div>
            </td>
            <td>Ksh ${p.price.toLocaleString()}</td>
            <td>${stockBadge}</td>
            <td>
              <div class="table-actions">
                <button class="btn-table-edit" data-id="${p.id}" title="Edit Product">
                  <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="btn-table-delete" data-id="${p.id}" title="Delete Product">
                  <i class="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      contentHtml = `
        <div class="admin-metrics">
          <div class="metric-card">
            <div class="metric-label">Total Products</div>
            <div class="metric-value">${totalProducts}</div>
          </div>
          <div class="metric-card" style="border-left-color: var(--danger);">
            <div class="metric-label">Out of Stock</div>
            <div class="metric-value">${outOfStock}</div>
          </div>
          <div class="metric-card" style="border-left-color: var(--accent-rose);">
            <div class="metric-label">Low Stock Warning</div>
            <div class="metric-value">${lowStock}</div>
          </div>
          <div class="metric-card" style="border-left-color: var(--success);">
            <div class="metric-label">Asset valuation</div>
            <div class="metric-value" style="font-size: 1.3rem;">Ksh ${totalInventoryValue.toLocaleString()}</div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-serif); font-weight: 500;">Product Catalog Inventory</h3>
          <button class="btn-admin-action" id="btn-open-add-product">
            <i class="fa-solid fa-plus"></i> Add New Product
          </button>
        </div>

        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th style="width: 50px;">No.</th>
                <th style="width: 60px;">Image</th>
                <th>Product Description</th>
                <th>Retail Price</th>
                <th>Inventory Stock</th>
                <th style="width: 100px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${productRows}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'orders') {
      const orderRows = orders.length > 0 ? orders.map((o, idx) => {
        const orderDate = new Date(o.date).toLocaleDateString('en-KE', {
          year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        const itemsSummary = o.items.map(item => `${item.name} (x${item.qty})`).join('<br>');
        
        return `
          <tr>
            <td><strong>${o.orderId}</strong></td>
            <td>
              <div style="font-weight: 600;">${o.customerName}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${o.customerEmail}</div>
            </td>
            <td><div style="font-size: 0.85rem; line-height: 1.4;">${itemsSummary}</div></td>
            <td>Ksh ${o.total.toLocaleString()}</td>
            <td><span style="font-size: 0.8rem; color: var(--text-secondary);">${orderDate}</span></td>
            <td>
              <span class="badge-stock" style="background-color: #e8f5e9; color: #2e7d32; font-weight: 600;">
                ${o.status}
              </span>
            </td>
          </tr>
        `;
      }).join('') : `<tr><td colspan="6" class="text-center" style="padding: 3rem;">No customer orders placed yet.</td></tr>`;

      contentHtml = `
        <div class="admin-metrics">
          <div class="metric-card" style="border-left-color: var(--success);">
            <div class="metric-label">Total Completed Revenue</div>
            <div class="metric-value">Ksh ${totalRevenue.toLocaleString()}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Completed Orders</div>
            <div class="metric-value">${orders.length}</div>
          </div>
        </div>

        <h3 style="font-family: var(--font-serif); margin-bottom: 1.5rem; font-weight: 500;">Store Transactions Ledger</h3>
        
        <div class="table-responsive">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Cart Items Purchased</th>
                <th>Grand Total</th>
                <th>Transaction Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${orderRows}
            </tbody>
          </table>
        </div>
      `;
    } else if (activeTab === 'settings') {
      contentHtml = `
        <h3 style="font-family: var(--font-serif); margin-bottom: 0.5rem; font-weight: 500;">Store Settings</h3>
        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 2rem;">Configure billing profiles and storefront identifiers.</p>
        
        <form class="admin-settings-form" id="admin-settings-form">
          <div class="form-group" style="margin-bottom: 1.5rem;">
            <label for="setting-paybill">Lipa na M-PESA Paybill Number</label>
            <input type="text" id="setting-paybill" value="${paybillSettings.paybillNumber}" minlength="5" maxlength="8" required>
            <span style="font-size: 0.75rem; color: var(--text-muted);">The primary corporate paybill displayed to clients on checkout.</span>
          </div>
          
          <div class="form-group" style="margin-bottom: 2rem;">
            <label for="setting-account">M-PESA Account Name Identifier</label>
            <input type="text" id="setting-account" value="${paybillSettings.accountName}" required>
            <span style="font-size: 0.75rem; color: var(--text-muted);">The business account name shown to clients (e.g. BEAUTYDESIGN).</span>
          </div>
          
          <button type="submit" class="btn-admin-action" style="padding: 0.9rem 2.5rem; border-radius: 4px;">
            Save Configurations <i class="fa-solid fa-floppy-disk" style="margin-left: 0.5rem;"></i>
          </button>
        </form>
      `;
    }

    return `
      <section class="admin-section">
        <div class="container">
          
          <!-- Admin Control Header -->
          <div class="admin-header-panel">
            <div class="admin-title-desc">
              <h2>Operations Control Room</h2>
              <p>Welcome, Kabal Guyo. Secure administration access authenticated.</p>
            </div>
            
            <a href="#home" class="btn-modal-cancel" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.6rem 1.2rem; border-radius: 30px;">
              <i class="fa-solid fa-store"></i> View Customer Storefront
            </a>
          </div>

          <!-- Main Admin Panel Split Grid -->
          <div class="admin-grid">
            <aside class="admin-sidebar">
              ${tabHtml}
            </aside>
            
            <main class="admin-content" id="admin-tab-content">
              ${contentHtml}
            </main>
          </div>
        </div>
      </section>

      <!-- Add/Edit Product Modal Dialog (Injected into Body markup but kept hidden unless triggered) -->
      <div class="modal-backdrop" id="product-modal-backdrop">
        <div class="admin-modal">
          <div class="modal-header">
            <h3 id="modal-title-text">Add New Beauty Product</h3>
            <button class="btn-close-cart" id="btn-close-modal" aria-label="Close dialog">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <form id="product-crud-form">
            <input type="hidden" id="crud-product-id">
            <div class="modal-body">
              <div class="form-group" style="margin-bottom: 1.2rem;">
                <label for="crud-name">Product Name</label>
                <input type="text" id="crud-name" placeholder="e.g. Botanical Hydrating Mask" required>
              </div>
              
              <div class="form-row-2" style="margin-bottom: 1.2rem;">
                <div class="form-group">
                  <label for="crud-category">Category</label>
                  <select id="crud-category" class="sort-select" style="background-color: var(--bg-secondary); border: 1px solid var(--color-gold-light); width: 100%; border-radius: 4px;" required>
                    <option value="Skincare">Skincare</option>
                    <option value="Cosmetics">Cosmetics</option>
                    <option value="Haircare">Haircare</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                </div>
                <div class="form-group">
                  <label for="crud-price">Price (Ksh)</label>
                  <input type="number" id="crud-price" min="50" placeholder="e.g. 2500" required>
                </div>
              </div>
              
              <div class="form-row-2" style="margin-bottom: 1.2rem;">
                <div class="form-group">
                  <label for="crud-stock">Initial Stock Quantity</label>
                  <input type="number" id="crud-stock" min="0" placeholder="e.g. 20" required>
                </div>
                <div class="form-group">
                  <label for="crud-image">Product Image URL</label>
                  <input type="url" id="crud-image" placeholder="https://images.unsplash.com/... or relative" required>
                </div>
              </div>
              
              <div class="form-group">
                <label for="crud-desc">Product Formulation Description</label>
                <textarea id="crud-desc" rows="4" style="width: 100%; border: 1px solid var(--color-gold-light); border-radius: 4px; padding: 0.8rem; background-color: var(--bg-primary); resize: vertical;" placeholder="Write a short summary detailing benefits, application instructions, and botanical properties..." required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn-modal-cancel" id="btn-cancel-modal">Cancel</button>
              <button type="submit" class="btn-modal-save" id="btn-save-product">Save Product Details</button>
            </div>
          </form>
        </div>
      </div>
    `;
  },

  // 7. About View
  about: () => {
    return `
      <section class="container section-padding info-section">
        <div class="info-grid">
          <div class="info-content">
            <span class="details-category">Our Philosophy</span>
            <h2>Timeless Elegance, Scientific Rigor</h2>
            <p>
              Founded in 2026, <strong>Beauty Design Intelligent Platform</strong> represents a radical re-imagination of digital skincare and cosmetic discovery. We believe that caring for your skin is an acts of curation, requiring products designed to align with your natural biological needs.
            </p>
            <p>
              We collaborate with premier laboratories globally to source botanically active ingredients, combining them with clean, dermatologist-validated clinical compounds. The results are concentrated serums, velvet lip tints, and nourishing oils that deliver premium results.
            </p>
            <p>
              Our storefront offers seamless, secured digital order tracking, instant M-PESA mobile banking integration, and customized shipping pipelines direct to your home. Enjoy bespoke luxury.
            </p>
          </div>
          <div class="info-visual">
            <img src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80" alt="Cosmetic formulation tubes" style="width:100%; object-fit: cover; aspect-ratio: 4/3;">
          </div>
        </div>
      </section>
    `;
  },

  // 8. Contact View
  contact: () => {
    return `
      <section class="container section-padding info-section">
        <div class="text-center" style="margin-bottom: 4rem;">
          <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 400;">Connect With Us</h2>
          <p style="color: var(--text-secondary); max-width: 500px; margin: 0.5rem auto 0 auto;">Our dedicated customer care associates are always available to assist with inquiries.</p>
        </div>
        
        <div class="contact-cards">
          <div class="contact-card">
            <i class="fa-solid fa-envelope-open-text"></i>
            <h4>Email Support</h4>
            <p>concierge@beautydesign.co.ke</p>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">24-hour reply time</p>
          </div>
          <div class="contact-card">
            <i class="fa-solid fa-phone-flip"></i>
            <h4>Premium Hotlines</h4>
            <p>+254 700 123 456</p>
            <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.5rem;">Mon - Fri, 9am - 6pm EAT</p>
          </div>
          <div class="contact-card">
            <i class="fa-solid fa-location-dot"></i>
            <h4>Executive Lounge</h4>
            <p>The Sandalwood Suites, Level 4</p>
            <p>Wood Avenue, Kilimani, Nairobi</p>
          </div>
        </div>
        
        <div class="auth-container" style="max-width: 600px; background-color: var(--bg-secondary);">
          <h3 style="font-family: var(--font-serif); margin-bottom: 1.5rem; text-align: center;">Send a Message</h3>
          <form class="auth-form" onsubmit="event.preventDefault(); alert('Message sent successfully. A beauty concierge agent will contact you shortly!'); this.reset();">
            <div class="form-row-2">
              <div class="form-group">
                <label for="contact-name">Your Name</label>
                <input type="text" id="contact-name" placeholder="John Doe" required>
              </div>
              <div class="form-group">
                <label for="contact-email">Email Address</label>
                <input type="email" id="contact-email" placeholder="john@example.com" required>
              </div>
            </div>
            <div class="form-group" style="margin-top: 1rem;">
              <label for="contact-msg">Message/Inquiry Details</label>
              <textarea id="contact-msg" rows="5" style="width: 100%; border: 1px solid var(--color-gold-light); border-radius: var(--border-radius-md); padding: 0.8rem; background-color: var(--bg-primary); resize: vertical;" placeholder="How can we assist you with skincare selections or order fulfillments?" required></textarea>
            </div>
            <button type="submit" class="btn-form-submit" style="margin-top: 1rem; width: auto; align-self: center; padding: 0.9rem 3rem;">Send message</button>
          </form>
        </div>
      </section>
    `;
  }
};
