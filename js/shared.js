// Shared JS
// Auth, Cart, Navbar, Utilities

// ---- Auth ----
const Auth = {
  getUser: () => JSON.parse(localStorage.getItem('session') || 'null'),
  login(user) { localStorage.setItem('session', JSON.stringify(user)); },
  logout() { localStorage.removeItem('session'); window.location.href = '/index.html'; },
  isLoggedIn() { return !!this.getUser(); },
  requireAuth() {
    if (!this.isLoggedIn()) {
      window.location.href = 'auth.html?next=' + encodeURIComponent(window.location.pathname);
    }
  }
};

// ---- Cart ----
const Cart = {
  get() { return JSON.parse(localStorage.getItem('cart') || '[]'); },
  save(items) { localStorage.setItem('cart', JSON.stringify(items)); },
  add(product, qty = 1) {
    const items = this.get();
    const existing = items.find(i => i.id === product.id);
    if (existing) { existing.qty += qty; }
    else { items.push({ ...product, qty }); }
    this.save(items);
    Cart.updateBadge();
    showToast(`<i class="fa-solid fa-circle-check"></i> Added to cart`);
  },
  remove(productId) {
    const items = this.get().filter(i => i.id !== productId);
    this.save(items);
    Cart.updateBadge();
  },
  updateQty(productId, qty) {
    const items = this.get();
    const item = items.find(i => i.id === productId);
    if (item) { item.qty = parseInt(qty); if (item.qty < 1) this.remove(productId); else this.save(items); }
    Cart.updateBadge();
  },
  clear() { localStorage.removeItem('cart'); Cart.updateBadge(); },
  total() { return this.get().reduce((sum, i) => sum + i.price * i.qty, 0); },
  count() { return this.get().reduce((sum, i) => sum + i.qty, 0); },
  updateBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
      const n = Cart.count();
      badge.textContent = n;
      badge.style.display = n > 0 ? 'flex' : 'none';
    }
  }
};

// ---- Orders ----
const Orders = {
  get() { return JSON.parse(localStorage.getItem('orders') || '[]'); },
  add(order) {
    const orders = this.get();
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
  },
  getById(id) { return this.get().find(o => o.orderId === id); },
  getByUser(userId) { return this.get().filter(o => o.userId === userId); }
};

// ---- Bookings ----
const Bookings = {
  get() { return JSON.parse(localStorage.getItem('bookings') || '[]'); },
  add(booking) {
    const arr = this.get();
    arr.push(booking);
    localStorage.setItem('bookings', JSON.stringify(arr));
  },
  getByUser(userId) { return this.get().filter(b => b.userId === userId); }
};

// ---- Users ----
const Users = {
  get() { return JSON.parse(localStorage.getItem('users') || '[]'); },
  save(users) { localStorage.setItem('users', JSON.stringify(users)); },
  findByEmail(email) { return this.get().find(u => u.email === email.toLowerCase()); },
  register(data) {
    const users = this.get();
    const id = 'USR-' + String(users.length + 1).padStart(5, '0');
    const user = { id, ...data, email: data.email.toLowerCase(), createdAt: new Date().toISOString() };
    users.push(user);
    this.save(users);
    return user;
  }
};

// ---- Toast Notification ----
function showToast(html, duration = 3000) {
  let toast = document.getElementById('gh-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'gh-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = html;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ---- Generate ID ----
function genId(prefix) {
  return prefix + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// ---- Format Currency ----
function fmt(n) { return '₵' + parseFloat(n).toFixed(2); }

// ---- Format Date ----
function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' });
}

// ---- Navbar & Footer Injection ----
function renderNavbar(activePage) {
  const user = Auth.getUser();
  const authBtn = user
    ? `<a href="dashboard.html" class="btn-nav"><i class="fa-solid fa-user" style="margin-right:6px"></i>${user.fullName.split(' ')[0]}</a>`
    : `<a href="auth.html" class="btn-nav"><i class="fa-solid fa-right-to-bracket" style="margin-right:6px"></i>Login</a>`;

  const navHTML = `
  <nav class="navbar">
    <a href="index.html" class="nav-logo">Glow<span>Haven</span></a>
    <ul class="nav-links">
      <li><a href="index.html" class="${activePage==='home'?'active':''}">Home</a></li>
      <li><a href="services.html" class="${activePage==='services'?'active':''}">Services</a></li>
      <li><a href="booking.html" class="${activePage==='booking'?'active':''}">Book Now</a></li>
      <li><a href="products.html" class="${activePage==='products'?'active':''}">Shop</a></li>
      <li><a href="contact.html" class="${activePage==='contact'?'active':''}">Contact</a></li>
    </ul>
    <div class="nav-actions">
      <button class="nav-icon-btn" onclick="window.location.href='cart.html'" title="Cart">
        <i class="fa-solid fa-bag-shopping"></i>
        <span class="cart-badge" id="cart-badge" style="display:none">0</span>
      </button>
      ${authBtn}
    </div>
  </nav>`;
  document.body.insertAdjacentHTML('afterbegin', navHTML);
  Cart.updateBadge();
}

function renderFooter() {
  const html = `
  <footer class="footer">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="nav-logo">Glow<span>Haven</span></div>
        <p>Premium men's grooming services and products. Look sharp, book smart.</p>
        <div class="footer-socials">
          <a href="#" class="social-icon" aria-label="Instagram" style="color:#E1306C"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="social-icon" aria-label="X" style="color:#f5f5f5"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" class="social-icon" aria-label="TikTok" style="color:#ff0050"><i class="fa-brands fa-tiktok"></i></a>
          <a href="#" class="social-icon" aria-label="Snapchat" style="color:#FFFC00"><i class="fa-brands fa-snapchat"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="services.html">Services</a></li>
          <li><a href="booking.html">Book Appointment</a></li>
          <li><a href="products.html">Shop Products</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Account</h4>
        <ul>
          <li><a href="auth.html">Login / Register</a></li>
          <li><a href="dashboard.html">My Dashboard</a></li>
          <li><a href="order-tracking.html">Track Order</a></li>
        </ul>
      </div>
      <div class="footer-col footer-contact">
        <h4>Contact</h4>
        <p><i class="fa-solid fa-location-dot"></i> 12 Barima Avenue, Accra</p>
        <p><i class="fa-solid fa-phone"></i> +233 24 000 0000</p>
        <p><i class="fa-solid fa-envelope"></i> hello@glowhaven.com</p>
        <p><i class="fa-solid fa-clock"></i> Mon–Sat: 9AM – 6PM</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 GlowHaven. All rights reserved.</p>
    </div>
  </footer>`;
  document.body.insertAdjacentHTML('beforeend', html);
}
