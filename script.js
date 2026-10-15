'use strict';

const BOOKS = [
  {id:1,title:'The Midnight Library',author:'Matt Haig',category:'Fiction',price:499,rating:'4.8',badge:'Bestseller',style:1,kicker:'A NOVEL',coverTitle:'The\nMidnight\nLibrary',coverAuthor:'MATT HAIG'},
  {id:2,title:'Atomic Habits',author:'James Clear',category:'Personal Growth',price:599,rating:'4.9',badge:'Reader favourite',style:4,kicker:'TINY CHANGES',coverTitle:'Atomic\nHabits',coverAuthor:'JAMES CLEAR'},
  {id:3,title:'The Silent Patient',author:'Alex Michaelides',category:'Mystery',price:449,rating:'4.7',badge:'Page-turner',style:9,kicker:'A THRILLER',coverTitle:'The Silent\nPatient',coverAuthor:'ALEX MICHAELIDES'},
  {id:4,title:'Pride and Prejudice',author:'Jane Austen',category:'Classics',price:299,rating:'4.8',badge:'Timeless',style:12,kicker:'A CLASSIC NOVEL',coverTitle:'Pride &\nPrejudice',coverAuthor:'JANE AUSTEN'},
  {id:5,title:'Ikigai',author:'Héctor García & Francesc Miralles',category:'Personal Growth',price:399,rating:'4.6',badge:'Quiet wisdom',style:10,kicker:'THE JAPANESE SECRET',coverTitle:'Ikigai',coverAuthor:'GARCÍA · MIRALLES'},
  {id:6,title:'The Alchemist',author:'Paulo Coelho',category:'Fiction',price:349,rating:'4.8',badge:'Beloved',style:6,kicker:'A FABLE ABOUT',coverTitle:'The\nAlchemist',coverAuthor:'PAULO COELHO'},
  {id:7,title:'Deep Work',author:'Cal Newport',category:'Non-fiction',price:549,rating:'4.7',badge:'Focus better',style:3,kicker:'RULES FOR FOCUSED SUCCESS',coverTitle:'Deep\nWork',coverAuthor:'CAL NEWPORT'},
  {id:8,title:'The Great Gatsby',author:'F. Scott Fitzgerald',category:'Classics',price:279,rating:'4.5',badge:'Modern classic',style:8,kicker:'A NOVEL',coverTitle:'The Great\nGatsby',coverAuthor:'F. SCOTT FITZGERALD'},
  {id:9,title:'The Housemaid',author:'Freida McFadden',category:'Mystery',price:479,rating:'4.7',badge:'Can’t put down',style:5,kicker:'A NOVEL',coverTitle:'The\nHousemaid',coverAuthor:'FREIDA MCFADDEN'},
  {id:10,title:'Educated',author:'Tara Westover',category:'Non-fiction',price:499,rating:'4.6',badge:'Memoir',style:7,kicker:'A MEMOIR',coverTitle:'Educated',coverAuthor:'TARA WESTOVER'},
  {id:11,title:'Little Women',author:'Louisa May Alcott',category:'Classics',price:329,rating:'4.8',badge:'Comfort read',style:2,kicker:'A CLASSIC',coverTitle:'Little\nWomen',coverAuthor:'LOUISA MAY ALCOTT'},
  {id:12,title:'Maybe You Should Talk to Someone',author:'Lori Gottlieb',category:'Non-fiction',price:525,rating:'4.7',badge:'Thought-provoking',style:11,kicker:'A THERAPIST, HER THERAPIST',coverTitle:'Maybe You\nShould Talk',coverAuthor:'LORI GOTTLIEB'}
];

const STORAGE = {cart:'bookverse-cart-v1', saved:'bookverse-saved-v1', profile:'bookverse-profile-v1', orders:'bookverse-orders-v1', newsletter:'bookverse-newsletter-v1'};
const state = {category:'All', query:'', sort:'featured', savedOnly:false, cart:loadStored(STORAGE.cart, []), saved:loadStored(STORAGE.saved, []), orders:loadStored(STORAGE.orders, []), profile:loadStoredObject(STORAGE.profile, null), newsletter:loadStoredObject(STORAGE.newsletter, null)};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
let toastTimer = null;
let lastFocusedElement = null;

function loadStored(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : fallback;
  } catch { return fallback; }
}
function loadStoredObject(key, fallback) {
  try { const value = JSON.parse(localStorage.getItem(key)); return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback; } catch { return fallback; }
}
function saveStored(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { showToast('Browser storage is unavailable; changes may not persist after closing this page.'); return false; }
}
function removeStored(key) { try { localStorage.removeItem(key); } catch { /* Storage may be blocked by browser settings. */ } }
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}
function money(value) {
  return new Intl.NumberFormat('en-IN', {style:'currency', currency:'INR', maximumFractionDigits:0}).format(value);
}
function getBook(id) { return BOOKS.find(book => book.id === Number(id)); }
function categoryCounts() {
  $$('.category-chip').forEach(chip => {
    const category = chip.dataset.category;
    const count = category === 'All' ? BOOKS.length : BOOKS.filter(book => book.category === category).length;
    const existing = chip.querySelector('span');
    if (category === 'All' && existing) existing.textContent = count;
  });
}
function getFilteredBooks() {
  let result = BOOKS.filter(book => {
    const matchesCategory = state.category === 'All' || book.category === state.category;
    const query = state.query.trim().toLocaleLowerCase();
    const matchesQuery = !query || [book.title, book.author, book.category].some(value => value.toLocaleLowerCase().includes(query));
    const matchesSaved = !state.savedOnly || state.saved.includes(book.id);
    return matchesCategory && matchesQuery && matchesSaved;
  });
  if (state.sort === 'price-low') result.sort((a,b) => a.price-b.price);
  if (state.sort === 'price-high') result.sort((a,b) => b.price-a.price);
  if (state.sort === 'title') result.sort((a,b) => a.title.localeCompare(b.title));
  return result;
}
function bookCard(book) {
  const saved = state.saved.includes(book.id);
  const coverTitle = escapeHTML(book.coverTitle).replace(/\n/g, '<br>');
  return `<article class="book-card">
    <div class="book-art">
      <span class="book-badge">${escapeHTML(book.badge)}</span>
      <button class="save-book ${saved?'is-saved':''}" type="button" data-action="save" data-id="${book.id}" aria-label="${saved?'Remove':'Save'} ${escapeHTML(book.title)} ${saved?'from':'to'} saved books" aria-pressed="${saved}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.4a4.7 4.7 0 0 1 8.8 2.3Z"/></svg></button>
      <div class="book-cover cover-style-${book.style}" aria-label="Decorative cover for ${escapeHTML(book.title)}" role="img"><span class="cover-kicker">${escapeHTML(book.kicker)}</span><span class="cover-art-mark" aria-hidden="true"></span><strong class="cover-title">${coverTitle}</strong><span class="cover-author">${escapeHTML(book.coverAuthor)}</span></div>
    </div>
    <div class="book-details"><p class="book-category">${escapeHTML(book.category)}</p><h3 class="book-title">${escapeHTML(book.title)}</h3><p class="book-author">by ${escapeHTML(book.author)}</p><div class="book-rating" aria-label="Rating ${book.rating} out of 5">★ <strong>${book.rating}</strong><span> / 5</span></div><div class="book-bottom"><span class="book-price">${money(book.price)}</span><button class="add-to-cart" type="button" data-action="add" data-id="${book.id}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l1 12H4L5 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/></svg> Add to bag</button></div></div>
  </article>`;
}
function renderBooks() {
  const books = getFilteredBooks();
  $('#bookGrid').innerHTML = books.map(bookCard).join('');
  $('#emptyState').hidden = books.length > 0;
  $('#bookGrid').hidden = books.length === 0;
  const total = books.length;
  let label = state.savedOnly ? `Showing ${total} saved ${total === 1 ? 'book' : 'books'}` : `Showing ${total} ${total === 1 ? 'book' : 'books'}`;
  if (state.category !== 'All') label += ` in ${state.category}`;
  if (state.query.trim()) label += ` for “${state.query.trim()}”`;
  $('#resultsLabel').textContent = label;
  $('#clearFilters').hidden = !(state.category !== 'All' || state.query.trim() || state.savedOnly);
  $$('.category-chip').forEach(chip => {
    const active = !state.savedOnly && chip.dataset.category === state.category;
    chip.classList.toggle('is-active', active);
    chip.setAttribute('aria-pressed', String(active));
  });
  $('#wishlistShortcut').setAttribute('aria-pressed', String(state.savedOnly));
  $('#wishlistShortcut').classList.toggle('is-selected', state.savedOnly);
}
function renderCart() {
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.cart.reduce((sum, item) => {
    const book = getBook(item.id); return sum + (book ? book.price * item.quantity : 0);
  }, 0);
  $('#cartCount').textContent = count;
  $('#cartTrigger').setAttribute('aria-label', `Open shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`);
  $('#drawerCount').textContent = `(${count})`;
  $('#cartSubtotal').textContent = money(subtotal);
  $('#shippingNote').textContent = subtotal >= 999 ? 'Lovely — your order qualifies for free shipping.' : `Add ${money(999-subtotal)} more for free shipping.`;
  $('#checkoutButton').disabled = count === 0;
  if (!state.cart.length) {
    $('#cartContent').innerHTML = `<div class="cart-empty"><span class="cart-empty-icon" aria-hidden="true">♡</span><h3>Your next favourite awaits</h3><p>Your bag is empty. Find a book that feels like it was written for you.</p><button class="button button-outline" type="button" data-action="continue-shopping">Explore books</button></div>`;
    return;
  }
  $('#cartContent').innerHTML = state.cart.map(item => {
    const book = getBook(item.id);
    if (!book) return '';
    return `<div class="cart-line"><div class="cart-mini-cover cover-style-${book.style}" aria-hidden="true">${escapeHTML(book.title)}</div><div class="cart-line-info"><h3 class="cart-line-title">${escapeHTML(book.title)}</h3><p class="cart-line-author">${escapeHTML(book.author)}</p><p class="cart-line-price">${money(book.price * item.quantity)}</p></div><div class="cart-line-actions"><div class="quantity-control" aria-label="Quantity for ${escapeHTML(book.title)}"><button type="button" data-action="decrease" data-id="${book.id}" aria-label="Decrease quantity">−</button><span>${item.quantity}</span><button type="button" data-action="increase" data-id="${book.id}" aria-label="Increase quantity">+</button></div><button class="remove-item" type="button" data-action="remove" data-id="${book.id}">Remove</button></div></div>`;
  }).join('');
}
function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}
function addToCart(id) {
  const book = getBook(id); if (!book) return;
  const existing = state.cart.find(item => item.id === book.id);
  if (existing) existing.quantity = Math.min(existing.quantity + 1, 99);
  else state.cart.push({id:book.id, quantity:1});
  saveStored(STORAGE.cart, state.cart); renderCart(); showToast(`${book.title} added to your bag`);
}
function changeQuantity(id, change) {
  const item = state.cart.find(entry => entry.id === Number(id)); if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) state.cart = state.cart.filter(entry => entry.id !== Number(id));
  if (item.quantity > 99) item.quantity = 99;
  saveStored(STORAGE.cart, state.cart); renderCart();
}
function removeFromCart(id) {
  const book = getBook(id);
  state.cart = state.cart.filter(item => item.id !== Number(id));
  saveStored(STORAGE.cart, state.cart); renderCart();
  if (book) showToast(`${book.title} removed from your bag`);
}
function toggleSaved(id) {
  const book = getBook(id); if (!book) return;
  if (state.saved.includes(book.id)) {
    state.saved = state.saved.filter(savedId => savedId !== book.id);
    showToast(`${book.title} removed from saved books`);
  } else {
    state.saved.push(book.id); showToast(`${book.title} saved for later`);
  }
  saveStored(STORAGE.saved, state.saved); renderBooks();
}
function setCategory(category) {
  state.category = category;
  state.savedOnly = false;
  renderBooks();
}
function resetFilters() {
  state.category = 'All'; state.query = ''; state.sort = 'featured'; state.savedOnly = false;
  $('#searchInput').value = ''; $('#sortSelect').value = 'featured'; renderBooks();
}
function openCart() {
  lastFocusedElement = document.activeElement;
  $('#scrim').hidden = false;
  $('#cartDrawer').classList.add('is-open');
  $('#cartDrawer').setAttribute('aria-hidden','false');
  $('#cartDrawer').inert = false;
  document.body.classList.add('no-scroll');
  $('#closeCart').focus();
}
function closeCart() {
  $('#cartDrawer').classList.remove('is-open');
  $('#cartDrawer').setAttribute('aria-hidden','true');
  $('#cartDrawer').inert = true;
  $('#scrim').hidden = true;
  document.body.classList.remove('no-scroll');
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') lastFocusedElement.focus();
}
function cartSubtotal() {
  return state.cart.reduce((sum, item) => { const book = getBook(item.id); return sum + (book ? book.price * item.quantity : 0); }, 0);
}
function openCheckout() {
  if (!state.cart.length) { showToast('Add a book to your bag before checkout.'); return; }
  closeCart();
  const backdrop = $('#checkoutBackdrop');
  $('#checkoutSummary').innerHTML = `<span>${state.cart.reduce((sum,item)=>sum+item.quantity,0)} item(s) in your bag</span><strong>${money(cartSubtotal())}</strong>`;
  if (state.profile) {
    $('#customerName').value = state.profile.name || '';
    $('#customerEmail').value = state.profile.email || '';
    $('#customerPhone').value = state.profile.phone || '';
    $('#customerAddress').value = state.profile.address || '';
  }
  backdrop.hidden = false;
  document.body.classList.add('no-scroll');
  $('#customerName').focus();
}
function closeCheckout() {
  $('#checkoutBackdrop').hidden = true;
  document.body.classList.remove('no-scroll');
  $('#checkoutButton').focus();
}
function renderLocalData() {
  const profile = state.profile;
  const orders = state.orders;
  const newsletter = state.newsletter;
  const safe = value => escapeHTML(value || 'Not saved');
  const orderRows = orders.length ? [...orders].reverse().slice(0, 5).map(order => `<div class="local-data-row"><span><strong>Order ${escapeHTML(order.id)}</strong><small>${escapeHTML(new Date(order.createdAt).toLocaleString())} · ${order.items.reduce((sum,item)=>sum+item.quantity,0)} item(s)</small></span><strong>${money(order.total)}</strong></div>`).join('') : '<p class="data-empty">No demo orders yet.</p>';
  $('#localDataSummary').innerHTML = `
    <section class="local-data-section"><h3>Saved customer details</h3><dl><div><dt>Name</dt><dd>${safe(profile?.name)}</dd></div><div><dt>Email</dt><dd>${safe(profile?.email)}</dd></div><div><dt>Phone</dt><dd>${safe(profile?.phone)}</dd></div><div><dt>Address</dt><dd>${safe(profile?.address)}</dd></div></dl></section>
    <section class="local-data-section"><h3>Newsletter</h3><p>${newsletter ? `Subscribed locally as <strong>${safe(newsletter.email)}</strong> on ${escapeHTML(new Date(newsletter.createdAt).toLocaleDateString())}.` : 'No newsletter signup saved.'}</p></section>
    <section class="local-data-section"><h3>Demo order history (${orders.length})</h3>${orderRows}</section>
    <section class="local-data-section"><h3>Shopping preferences</h3><p>${state.cart.reduce((sum,item)=>sum+item.quantity,0)} item(s) in cart · ${state.saved.length} saved book(s).</p></section>`;
}
function openLocalData() {
  renderLocalData();
  $('#localDataBackdrop').hidden = false;
  document.body.classList.add('no-scroll');
  $('#closeLocalData').focus();
}
function closeLocalData() {
  $('#localDataBackdrop').hidden = true;
  document.body.classList.remove('no-scroll');
  $('#openLocalData').focus();
}
function exportLocalData() {
  const payload = {exportedAt:new Date().toISOString(), profile:state.profile, newsletter:state.newsletter, cart:state.cart, savedBooks:state.saved.map(getBook).filter(Boolean).map(book=>({id:book.id,title:book.title})), orders:state.orders};
  const blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = 'bookverse-local-data.json';
  document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  showToast('Your local demo data export has been prepared.');
}
function clearLocalData() {
  const confirmed = window.confirm('Clear all BookVerse demo data saved in this browser? This cannot be undone.');
  if (!confirmed) return;
  Object.values(STORAGE).forEach(removeStored);
  state.cart = []; state.saved = []; state.orders = []; state.profile = null; state.newsletter = null;
  $('#customerName').value = ''; $('#customerEmail').value = ''; $('#customerPhone').value = ''; $('#customerAddress').value = '';
  $('#newsletterEmail').value = '';
  renderBooks(); renderCart(); renderLocalData();
  showToast('All BookVerse local demo data has been cleared.');
}
function placeDemoOrder(event) {
  event.preventDefault();
  const form = $('#checkoutForm');
  if (!form.reportValidity() || !state.cart.length) return;
  const profile = {
    name: $('#customerName').value.trim(),
    email: $('#customerEmail').value.trim(),
    phone: $('#customerPhone').value.trim(),
    address: $('#customerAddress').value.trim()
  };
  if (!profile.name || !profile.email || !profile.address) { showToast('Please complete the required fields.'); return; }
  const items = state.cart.map(item => { const book = getBook(item.id); return book ? {id:book.id,title:book.title,author:book.author,unitPrice:book.price,quantity:item.quantity} : null; }).filter(Boolean);
  if (!items.length) { showToast('Your bag is empty.'); return; }
  const subtotal = items.reduce((sum,item)=>sum+item.unitPrice*item.quantity,0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const order = {id:`BV-${Date.now().toString().slice(-8)}`,createdAt:new Date().toISOString(),items,subtotal,total:subtotal+shipping,shipping,status:'Demo order — not submitted to a store'};
  state.orders.push(order);
  saveStored(STORAGE.orders,state.orders);
  if ($('#saveProfileConsent').checked) { state.profile = profile; saveStored(STORAGE.profile,state.profile); }
  state.cart = []; saveStored(STORAGE.cart,state.cart); renderCart(); renderBooks();
  $('#checkoutBackdrop').hidden = true; document.body.classList.remove('no-scroll');
  showToast(`Demo order ${order.id} saved in this browser.`);
  window.alert(`Thank you, ${profile.name}!\n\nDemo order: ${order.id}\nSubtotal: ${money(subtotal)}\nShipping: ${order.shipping === 0 ? 'Free' : money(order.shipping)}\n\nThis is a local demo only. No payment was taken and no order was sent to a server.`);
}

function toggleMobileNav() {
  const nav = $('#primaryNav');
  const button = $('#mobileMenuButton');
  const open = nav.classList.toggle('is-open');
  button.setAttribute('aria-expanded', String(open));
  button.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
}

$('#bookGrid').addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const {action, id} = button.dataset;
  if (action === 'add') addToCart(id);
  if (action === 'save') toggleSaved(id);
});
$('#cartContent').addEventListener('click', event => {
  const button = event.target.closest('[data-action]'); if (!button) return;
  const {action, id} = button.dataset;
  if (action === 'increase') changeQuantity(id, 1);
  if (action === 'decrease') changeQuantity(id, -1);
  if (action === 'remove') removeFromCart(id);
  if (action === 'continue-shopping') closeCart();
});
$('#categoryFilters').addEventListener('click', event => {
  const button = event.target.closest('[data-category]'); if (!button) return;
  setCategory(button.dataset.category);
});
$$('[data-nav-category]').forEach(link => link.addEventListener('click', () => {
  const category = link.dataset.navCategory;
  if (category) setCategory(category);
  $('#primaryNav').classList.remove('is-open');
  $('#mobileMenuButton').setAttribute('aria-expanded','false');
  $('#mobileMenuButton').setAttribute('aria-label','Open navigation');
}));
$('#searchForm').addEventListener('submit', event => { event.preventDefault(); state.query = $('#searchInput').value; state.savedOnly = false; renderBooks(); $('#catalogue').scrollIntoView({behavior:'smooth',block:'start'}); });
$('#searchInput').addEventListener('input', () => { state.query = $('#searchInput').value; state.savedOnly = false; renderBooks(); });
$('#sortSelect').addEventListener('change', event => { state.sort = event.target.value; renderBooks(); });
$('#clearFilters').addEventListener('click', resetFilters);
$('#resetSearch').addEventListener('click', resetFilters);
$('#wishlistShortcut').addEventListener('click', () => {
  state.savedOnly = !state.savedOnly;
  if (state.savedOnly) { state.category = 'All'; state.query = ''; $('#searchInput').value = ''; }
  renderBooks(); $('#catalogue').scrollIntoView({behavior:'smooth',block:'start'});
  if (state.savedOnly && !state.saved.length) showToast('Save a book using the heart icon to find it here');
});
$('#cartTrigger').addEventListener('click', openCart);
$('#closeCart').addEventListener('click', closeCart);
$('#scrim').addEventListener('click', closeCart);
$('#mobileMenuButton').addEventListener('click', toggleMobileNav);
$('#checkoutButton').addEventListener('click', openCheckout);
$('#closeCheckout').addEventListener('click', closeCheckout);
$('#checkoutBackdrop').addEventListener('click', event => { if (event.target === $('#checkoutBackdrop')) closeCheckout(); });
$('#checkoutForm').addEventListener('submit', placeDemoOrder);
$('#openLocalData').addEventListener('click', openLocalData);
$('#closeLocalData').addEventListener('click', closeLocalData);
$('#localDataBackdrop').addEventListener('click', event => { if (event.target === $('#localDataBackdrop')) closeLocalData(); });
$('#exportLocalData').addEventListener('click', exportLocalData);
$('#clearLocalData').addEventListener('click', clearLocalData);
$('#newsletterForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = $('#newsletterEmail');
  if (!email.checkValidity()) { email.reportValidity(); return; }
  const normalizedEmail = email.value.trim().toLowerCase();
  state.newsletter = {email:normalizedEmail, createdAt:new Date().toISOString()};
  saveStored(STORAGE.newsletter, state.newsletter);
  email.value = '';
  showToast('You’re on the local demo reading list. Your email stays in this browser.');
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!$('#checkoutBackdrop').hidden) closeCheckout();
    if (!$('#localDataBackdrop').hidden) closeLocalData();
    if ($('#cartDrawer').classList.contains('is-open')) closeCart();
    if ($('#primaryNav').classList.contains('is-open')) { $('#primaryNav').classList.remove('is-open'); $('#mobileMenuButton').setAttribute('aria-expanded','false'); }
  }
  if (event.key === 'Tab' && $('#cartDrawer').classList.contains('is-open')) {
    const focusable = $$('button:not(:disabled),a[href],input,select,[tabindex]:not([tabindex="-1"])', $('#cartDrawer')).filter(el => !el.hidden);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length-1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 760 && $('#primaryNav').classList.contains('is-open')) {
    $('#primaryNav').classList.remove('is-open'); $('#mobileMenuButton').setAttribute('aria-expanded','false');
  }
});
$('#currentYear').textContent = new Date().getFullYear();
categoryCounts();
renderBooks();
renderCart();
