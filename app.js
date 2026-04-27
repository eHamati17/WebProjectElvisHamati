/*  app.js  –  shared logic for CINEMA (localStorage edition)
    Replaces: config.php, database.sql, session handling
*/

// ─── Seed default data on first visit ───────────────────────
(function initDB() {
  if (!localStorage.getItem('cinema_init')) {
    // Default admin account
    const users = [
      { id: 1, name: 'Admin', email: 'admin@cinema.com', password: 'admin123', user_type: 'admin' }
    ];
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user_id_seq', '1');

    // Default products (movies)
    const products = [
      { id: 1, name: 'Godzilla x Kong', price: 12.99, image: 'Godzilla_x_kong_the_new_empire_poster.jpg' },
      { id: 2, name: 'Deadpool & Wolverine', price: 14.99, image: 'deadpool_wolverine.jpg' },
      { id: 3, name: 'Dune: Part Two', price: 13.99, image: 'dune.jpg' },
      { id: 4, name: 'The Garfield Movie', price: 9.99, image: 'garfield.jpg' }
    ];
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('product_id_seq', '4');

    localStorage.setItem('cart', JSON.stringify([]));
    localStorage.setItem('orders', JSON.stringify([]));
    localStorage.setItem('cinema_init', 'true');
  }
})();

// ─── Helpers ────────────────────────────────────────────────
function getUsers()    { return JSON.parse(localStorage.getItem('users')    || '[]'); }
function getProducts() { return JSON.parse(localStorage.getItem('products') || '[]'); }
function getCart()     { return JSON.parse(localStorage.getItem('cart')      || '[]'); }
function getOrders()   { return JSON.parse(localStorage.getItem('orders')   || '[]'); }

function saveUsers(u)    { localStorage.setItem('users',    JSON.stringify(u)); }
function saveProducts(p) { localStorage.setItem('products', JSON.stringify(p)); }
function saveCart(c)     { localStorage.setItem('cart',      JSON.stringify(c)); }
function saveOrders(o)   { localStorage.setItem('orders',   JSON.stringify(o)); }

function nextUserId() {
  let seq = parseInt(localStorage.getItem('user_id_seq') || '0') + 1;
  localStorage.setItem('user_id_seq', String(seq));
  return seq;
}
function nextProductId() {
  let seq = parseInt(localStorage.getItem('product_id_seq') || '0') + 1;
  localStorage.setItem('product_id_seq', String(seq));
  return seq;
}

// ─── Session (replaces PHP $_SESSION) ───────────────────────
function setSession(user) {
  sessionStorage.setItem('cinema_session', JSON.stringify({
    id: user.id,
    name: user.name,
    email: user.email,
    user_type: user.user_type
  }));
}
function getSession() {
  const s = sessionStorage.getItem('cinema_session');
  return s ? JSON.parse(s) : null;
}
function clearSession() {
  sessionStorage.removeItem('cinema_session');
}
function requireAuth(type) {
  const s = getSession();
  if (!s) { window.location.href = 'login.html'; return null; }
  if (type && s.user_type !== type) { window.location.href = 'login.html'; return null; }
  return s;
}

// ─── Toast messages (replaces PHP $message[]) ───────────────
function showMessage(text, isError) {
  const existing = document.querySelector('.message');
  if (existing) existing.remove();

  const div = document.createElement('div');
  div.className = 'message';
  div.innerHTML = `<span>${text}</span><i class="fa-solid fa-xmark" onclick="this.parentElement.remove();"></i>`;
  if (isError) div.style.backgroundColor = '#fee2e2';
  document.body.prepend(div);

  setTimeout(() => div.remove(), 4000);
}
