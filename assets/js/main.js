// ABC Fitness — enhanced mobile UX
(function(){
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.getElementById('menu');
  if (toggle && menu) {
    const closeMenu = () => { toggle.setAttribute('aria-expanded','false'); menu.classList.remove('open'); menu.setAttribute('aria-expanded','false'); };
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(!expanded));
    });
    // Close when a link is clicked (mobile)
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click', closeMenu));
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Newsletter form
  const newsletter = document.getElementById('newsletter-form');
  if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletter.querySelector('[name="email"]');
      const msg = document.getElementById('newsletter-msg');
      const ok = /\S+@\S+\.\S+/.test(email.value);
      if (!ok) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = 'var(--danger)'; email.focus(); return; }
      msg.textContent = 'Thanks for subscribing! Please check your inbox to confirm.'; msg.style.color = 'var(--fg)'; email.value = '';
    });
  }

  // Simple cart using localStorage
  const CART_KEY = 'abc_fitness_cart_v1';
  function readCart(){ try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch(e){ return []; } }
  function writeCart(items){ localStorage.setItem(CART_KEY, JSON.stringify(items)); updateCartCount(); }
  function updateCartCount(){ const count = readCart().reduce((a,i)=>a+i.qty,0); const el = document.getElementById('cart-count'); if (el) el.textContent = String(count); }
  updateCartCount();
  function addToCart(item){ const cart = readCart(); const idx = cart.findIndex(i=>i.id===item.id); if (idx>-1){ cart[idx].qty += 1; } else { cart.push({...item, qty:1}); } writeCart(cart); }
  function removeFromCart(id){ const cart = readCart().filter(i=>i.id!==id); writeCart(cart); renderCart(); }
  function changeQty(id, delta){ const cart = readCart().map(i=>{ if (i.id===id){ i.qty = Math.max(1, i.qty + delta); } return i; }); writeCart(cart); renderCart(); }
  document.querySelectorAll('[data-add-to-cart]')?.forEach(btn=>{ btn.addEventListener('click', ()=>{ const item = { id: btn.getAttribute('data-id'), name: btn.getAttribute('data-name'), price: parseFloat(btn.getAttribute('data-price')), image: btn.getAttribute('data-image') }; addToCart(item); }); });
  const cartDialog = document.getElementById('cartDialog'); const cartListEl = document.getElementById('cart-list'); const cartTotalEl = document.getElementById('cart-total');
  function renderCart(){ if (!cartListEl || !cartTotalEl) return; const items = readCart(); cartListEl.innerHTML=''; let total=0; items.forEach(i=>{ total += i.price*i.qty; const li = document.createElement('li'); li.className='cart-item'; li.innerHTML = `
<img src="${i.image}" alt="${i.name}">
<div><strong>${i.name}</strong><br><small>$${i.price.toFixed(2)} each</small></div>
<div class="qty"><button aria-label="Decrease quantity" class="btn" data-dec="${i.id}">−</button><span>${i.qty}</span><button aria-label="Increase quantity" class="btn" data-inc="${i.id}">+</button></div>
<div><button aria-label="Remove ${i.name} from cart" class="btn" data-remove="${i.id}">Remove</button></div>`; cartListEl.appendChild(li); }); cartTotalEl.textContent = `$${total.toFixed(2)}`; cartListEl.querySelectorAll('[data-dec]')?.forEach(b=>b.addEventListener('click',()=>changeQty(b.getAttribute('data-dec'), -1))); cartListEl.querySelectorAll('[data-inc]')?.forEach(b=>b.addEventListener('click',()=>changeQty(b.getAttribute('data-inc'), +1))); cartListEl.querySelectorAll('[data-remove]')?.forEach(b=>b.addEventListener('click',()=>removeFromCart(b.getAttribute('data-remove')))); }
  const openCartBtn = document.getElementById('openCart'); if (openCartBtn && cartDialog) { openCartBtn.addEventListener('click', ()=>{ renderCart(); if (cartDialog.showModal) cartDialog.showModal(); else cartDialog.setAttribute('open',''); }); }
  const closeCartBtn = document.getElementById('closeCart'); if (closeCartBtn && cartDialog) { closeCartBtn.addEventListener('click', ()=>{ if (cartDialog.close) cartDialog.close(); else cartDialog.removeAttribute('open'); }); }
  const clearCartBtn = document.getElementById('clearCart'); if (clearCartBtn) { clearCartBtn.addEventListener('click', ()=>{ localStorage.removeItem(CART_KEY); renderCart(); updateCartCount(); }); }
  const feedbackForm = document.getElementById('feedback-form'); if (feedbackForm) { feedbackForm.addEventListener('submit', (e)=>{ e.preventDefault(); const form = new FormData(feedbackForm); const name = String(form.get('name')||'').trim(); const email = String(form.get('email')||'').trim(); const message = String(form.get('message')||'').trim(); const msgEl = document.getElementById('feedback-msg'); if (!name || !/\S+@\S+\.\S+/.test(email) || message.length < 10){ msgEl.textContent = 'Please complete all required fields (message at least 10 characters).'; msgEl.style.color = 'var(--danger)'; return; } msgEl.textContent = 'Thanks! Your feedback/custom order has been received.'; msgEl.style.color = 'var(--fg)'; feedbackForm.reset(); }); }
})();
