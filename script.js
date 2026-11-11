// Starter catalog: replace these demo items, prices, and photos with your real inventory.
const products = [
  { id: 'performance-tee', name: 'Performance Training Tee', category: 'tops', categoryLabel: 'TRAINING TOP', price: 1800, badge: 'EVERYDAY ESSENTIAL', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80', alt: 'Classic athletic training t-shirt' },
  { id: 'active-shorts', name: 'Active Move Shorts', category: 'bottoms', categoryLabel: 'TRAINING BOTTOM', price: 2200, badge: 'MADE TO MOVE', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=80', alt: 'Comfortable athletic training shorts' },
  { id: 'training-set', name: 'Elevate Training Set', category: 'sets', categoryLabel: 'MATCHING SET', price: 4200, badge: 'THE FULL LOOK', image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80', alt: 'Athletic training outfit' },
  { id: 'run-club-tee', name: 'Run Club Essential Tee', category: 'tops', categoryLabel: 'RUN & RECOVER', price: 1900, badge: 'CUSTOMER FAVOURITE', image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80', alt: 'Lightweight everyday sports t-shirt' }
];
// Add the business WhatsApp number with country code only, e.g. '2547XXXXXXXX'. Leave blank until confirmed.
const WHATSAPP_NUMBER = '';
const money = amount => `KSh ${amount.toLocaleString('en-KE')}`;
let cart = JSON.parse(localStorage.getItem('elevate-cart') || '[]');
let toastTimer;
const grid = document.querySelector('#product-grid');
const panel = document.querySelector('#cart-panel');
const overlay = document.querySelector('#overlay');

function renderProducts(filter = 'all') {
  const visible = products.filter(product => filter === 'all' || product.category === filter);
  grid.innerHTML = visible.map(product => `
    <article class="product-card">
      <div class="product-image-wrap"><img src="${product.image}" alt="${product.alt}" loading="lazy"><span class="product-badge">${product.badge}</span><button class="quick-add" data-add="${product.id}">Add to bag +</button></div>
      <div class="product-info"><div class="product-title-row"><h3>${product.name}</h3><span class="product-price">${money(product.price)}</span></div><p class="product-category">${product.categoryLabel}</p></div>
    </article>`).join('');
}
function saveCart() {
  localStorage.setItem('elevate-cart', JSON.stringify(cart));
  renderCart();
}
function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ id, quantity: 1 });
  saveCart();
  showToast(`${products.find(product => product.id === id).name} added to your bag`);
}
function renderCart() {
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.querySelector('#cart-count').textContent = count;
  document.querySelector('#cart-heading-count').textContent = `(${count})`;
  const items = document.querySelector('#cart-items');
  const empty = count === 0;
  document.querySelector('#cart-empty').hidden = !empty;
  document.querySelector('#cart-footer').hidden = empty;
  if (empty) { items.innerHTML = ''; return; }
  items.innerHTML = cart.map(item => {
    const product = products.find(candidate => candidate.id === item.id);
    if (!product) return '';
    return `<article class="cart-item"><img src="${product.image}" alt="" loading="lazy"><div><h3>${product.name}</h3><p>${money(product.price)} each</p><div class="quantity-control"><button data-quantity="${product.id}" data-change="-1" aria-label="Remove one ${product.name}">−</button><span>${item.quantity}</span><button data-quantity="${product.id}" data-change="1" aria-label="Add one ${product.name}">+</button></div></div><div><div class="cart-item-price">${money(product.price * item.quantity)}</div><button class="remove-item" data-remove="${product.id}">Remove</button></div></article>`;
  }).join('');
  const subtotal = cart.reduce((total, item) => total + (products.find(p => p.id === item.id)?.price || 0) * item.quantity, 0);
  document.querySelector('#cart-subtotal').textContent = money(subtotal);
}
function openCart() {
  panel.classList.add('is-open'); panel.setAttribute('aria-hidden', 'false'); overlay.hidden = false;
  document.body.style.overflow = 'hidden'; document.querySelector('#cart-close').focus();
}
function closeCart() {
  panel.classList.remove('is-open'); panel.setAttribute('aria-hidden', 'true'); overlay.hidden = true;
  document.body.style.overflow = ''; document.querySelector('#cart-open').focus();
}
function showToast(message) {
  const toast = document.querySelector('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (button) addToCart(button.dataset.add);
});
document.querySelector('.filter-row').addEventListener('click', event => {
  const button = event.target.closest('[data-filter]'); if (!button) return;
  document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip === button));
  renderProducts(button.dataset.filter);
});
document.querySelector('#cart-items').addEventListener('click', event => {
  const remove = event.target.closest('[data-remove]');
  const quantity = event.target.closest('[data-quantity]');
  if (remove) cart = cart.filter(item => item.id !== remove.dataset.remove);
  if (quantity) {
    const item = cart.find(entry => entry.id === quantity.dataset.quantity);
    if (item) item.quantity += Number(quantity.dataset.change);
    cart = cart.filter(entry => entry.quantity > 0);
  }
  saveCart();
});
document.querySelector('#cart-open').addEventListener('click', openCart);
document.querySelector('#cart-close').addEventListener('click', closeCart);
document.querySelector('#continue-shopping').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.addEventListener('keydown', event => { if (event.key === 'Escape' && panel.classList.contains('is-open')) closeCart(); });
document.querySelector('#checkout').addEventListener('click', () => {
  if (!WHATSAPP_NUMBER) {
    document.querySelector('#checkout-hint').textContent = 'WhatsApp checkout is ready to connect. Add your business number in script.js to accept orders.';
    return;
  }
  const lines = cart.map(item => {
    const product = products.find(candidate => candidate.id === item.id);
    return `${product.name} x${item.quantity} — ${money(product.price * item.quantity)}`;
  });
  const total = cart.reduce((sum, item) => sum + (products.find(p => p.id === item.id)?.price || 0) * item.quantity, 0);
  const message = `Hi Elevate Sports KE! I'd like to order:\n${lines.join('\n')}\nSubtotal: ${money(total)}\n\nPlease confirm sizes, availability, and delivery.`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
});
document.querySelector('#year').textContent = new Date().getFullYear();
renderProducts();
renderCart();
