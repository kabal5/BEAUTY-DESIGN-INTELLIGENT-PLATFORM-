/* ==========================================================================
   Beauty Design Intelligent Platform - Data & LocalStorage Management
   ========================================================================== */

const SEED_PRODUCTS = [
  {
    id: "prod-1",
    name: "Rosehip Infused Cleansing Oil",
    category: "Skincare",
    price: 3400,
    rating: 4.8,
    reviewsCount: 124,
    stock: 15,
    description: "A gentle yet effective botanical cleansing oil formulated with organic cold-pressed rosehip seed extract. Melts away stubborn makeup, pollutants, and sebum without stripping away your skin's natural moisture barrier.",
    imageUrl: "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=600&q=80",
    featured: true
  },
  {
    id: "prod-2",
    name: "Niacinamide Glowing Water Serum",
    category: "Skincare",
    price: 4800,
    rating: 4.9,
    reviewsCount: 312,
    stock: 8,
    description: "An advanced hydrating water serum concentrated with 10% pure Niacinamide and Zinc PCA. Reduces visible dark spots, refines pores, evens skin tone, and delivers an immediate luminous 'glass skin' dewiness.",
    imageUrl: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=600&q=80",
    featured: true
  },
  {
    id: "prod-3",
    name: "Velvet Matte Luxe Lipstick (Rose Bloom)",
    category: "Cosmetics",
    price: 2600,
    rating: 4.6,
    reviewsCount: 89,
    stock: 22,
    description: "A weightless matte lipstick offering full-coverage pigmentation in a single swipe. Infused with moisturizing hyaluronic acid spheres and shea butter to prevent dryness and maintain a velvet rose petals texture all day.",
    imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
    featured: false
  },
  {
    id: "prod-4",
    name: "Liquid Silk Radiant Highlighter",
    category: "Cosmetics",
    price: 3200,
    rating: 4.7,
    reviewsCount: 145,
    stock: 5,
    description: "An ultra-fine liquid illuminator formulated with light-reflecting micro-pearls. Can be worn alone on high points of the face or mixed with mineral foundation to achieve an elegant, sun-kissed, high-fashion sheen.",
    imageUrl: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=600&q=80",
    featured: true
  },
  {
    id: "prod-5",
    name: "Sandalwood Botanical Eau de Parfum",
    category: "Fragrance",
    price: 9500,
    rating: 5.0,
    reviewsCount: 54,
    stock: 4,
    description: "A mystical, warm fragrance profile opening with sensory notes of fresh cardamon, moving into a heart of white iris, and finishing with a grounding base of Mysore sandalwood and organic amberwood essences.",
    imageUrl: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=600&q=80",
    featured: true
  },
  {
    id: "prod-6",
    name: "Ceramide Intense Repair Barrier Cream",
    category: "Skincare",
    price: 4200,
    rating: 4.8,
    reviewsCount: 203,
    stock: 0,
    description: "An intensive clinical recovery moisturizer rich in lipids, cholesterol, and five essential ceramides (1, 2, 3, 6 II). Deeply reconstructs dehydrated skin, relieves redness, and shields against dry atmospheric conditions.",
    imageUrl: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80",
    featured: false
  },
  {
    id: "prod-7",
    name: "Nourishing Avocado Hair Therapy Oil",
    category: "Haircare",
    price: 3800,
    rating: 4.7,
    reviewsCount: 96,
    stock: 12,
    description: "A restorative pre-wash and leave-in hair serum made from cold-pressed avocado fruit oil, jojoba seeds, and sweet almond extracts. Repairs split ends, restores structural shine, and shields against high-temperature styling tools.",
    imageUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&w=600&q=80",
    featured: false
  },
  {
    id: "prod-8",
    name: "Flawless Mineral Skin Foundation",
    category: "Cosmetics",
    price: 4500,
    rating: 4.5,
    reviewsCount: 167,
    stock: 19,
    description: "A breathable, medium-to-full buildable coverage foundation containing natural minerals and UV SPF 20. Glides on like liquid silk, absorbs excess oil, and leaves an airbrushed, healthy semi-matte finish.",
    imageUrl: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80",
    featured: false
  }
];

const SEED_USERS = [
  {
    email: "admin@beauty.com",
    password: "admin", // in production we would hash passwords, but localStorage is for mocking
    name: "Elena Vance (Admin)",
    role: "admin"
  },
  {
    email: "user@beauty.com",
    password: "user",
    name: "Sarah Jenkins",
    role: "customer"
  }
];

const DEFAULT_SETTINGS = {
  paybillNumber: "247247",
  accountName: "BEAUTYDESIGN"
};

const DEFAULT_ORDERS = [
  {
    orderId: "BD-4890",
    customerEmail: "user@beauty.com",
    customerName: "Sarah Jenkins",
    date: "2026-07-15T14:32:00+03:00",
    items: [
      { id: "prod-2", name: "Niacinamide Glowing Water Serum", qty: 1, price: 4800 },
      { id: "prod-3", name: "Velvet Matte Luxe Lipstick (Rose Bloom)", qty: 1, price: 2600 }
    ],
    total: 7400,
    status: "Completed"
  }
];

class BeautyDatabase {
  constructor() {
    this.init();
  }

  init() {
    if (!localStorage.getItem("bd_products")) {
      localStorage.setItem("bd_products", JSON.stringify(SEED_PRODUCTS));
    }
    if (!localStorage.getItem("bd_users")) {
      localStorage.setItem("bd_users", JSON.stringify(SEED_USERS));
    }
    if (!localStorage.getItem("bd_settings")) {
      localStorage.setItem("bd_settings", JSON.stringify(DEFAULT_SETTINGS));
    }
    if (!localStorage.getItem("bd_orders")) {
      localStorage.setItem("bd_orders", JSON.stringify(DEFAULT_ORDERS));
    }
  }

  // Products
  getProducts() {
    return JSON.parse(localStorage.getItem("bd_products"));
  }

  saveProducts(products) {
    localStorage.setItem("bd_products", JSON.stringify(products));
  }

  getProductById(id) {
    return this.getProducts().find(p => p.id === id);
  }

  addProduct(product) {
    const products = this.getProducts();
    const newProduct = {
      ...product,
      id: "prod-" + (Date.now()),
      rating: 5.0,
      reviewsCount: 0
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  updateProduct(updatedProd) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === updatedProd.id);
    if (index !== -1) {
      // Preserve reviews and rating
      products[index] = {
        ...products[index],
        ...updatedProd
      };
      this.saveProducts(products);
      return true;
    }
    return false;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const filtered = products.filter(p => p.id !== id);
    if (filtered.length !== products.length) {
      this.saveProducts(filtered);
      return true;
    }
    return false;
  }

  // Users
  getUsers() {
    return JSON.parse(localStorage.getItem("bd_users"));
  }

  saveUsers(users) {
    localStorage.setItem("bd_users", JSON.stringify(users));
  }

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  registerUser(name, email, password) {
    const users = this.getUsers();
    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: "An account with this email already exists." };
    }
    const newUser = {
      name,
      email,
      password,
      role: "customer" // registration only allowed for customers! Admin remains seeded
    };
    users.push(newUser);
    this.saveUsers(users);
    return { success: true, user: newUser };
  }

  // Settings (Paybill)
  getSettings() {
    return JSON.parse(localStorage.getItem("bd_settings"));
  }

  saveSettings(settings) {
    localStorage.setItem("bd_settings", JSON.stringify(settings));
  }

  // Orders
  getOrders() {
    return JSON.parse(localStorage.getItem("bd_orders"));
  }

  saveOrders(orders) {
    localStorage.setItem("bd_orders", JSON.stringify(orders));
  }

  createOrder(order) {
    const orders = this.getOrders();
    const newOrder = {
      ...order,
      orderId: "BD-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString(),
      status: "Pending"
    };
    orders.unshift(newOrder);
    this.saveOrders(orders);
    
    // Deduct inventory stock
    const products = this.getProducts();
    newOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.qty);
      }
    });
    this.saveProducts(products);
    
    return newOrder;
  }
}

// Global database instance
const db = new BeautyDatabase();
