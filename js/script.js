// ---------- HAMBURGER MENU ----------
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});




// ---------- DARK/LIGHT MODE ----------
const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

// ---------- CART LOGIC ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartCount = document.getElementById('cart-count');
function updateCartCount() {
  if (cartCount) cartCount.textContent = cart.length;
}
updateCartCount();

document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = {
      name: btn.dataset.name,
      price: parseInt(btn.dataset.price),
      image: btn.dataset.image
    };
    cart.push(item);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    btn.textContent = 'Added!';
    setTimeout(() => btn.textContent = 'Add to Cart', 1200);
  });
});

// ---------- DISPLAY CART ----------
const cartItems = document.getElementById('cart-items');
if (cartItems) {
  const totalDisplay = document.getElementById('cart-total');
  function renderCart() {
    cartItems.innerHTML = '';
    let total = 0;
    cart.forEach((item, i) => {
      total += item.price;
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}">
        <span>${item.name}</span>
        <span>₦${item.price.toLocaleString()}</span>
        <button onclick="removeItem(${i})">❌</button>`;
      cartItems.appendChild(div);
    });
    totalDisplay.textContent = total.toLocaleString();
  }
  window.removeItem = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
  };
  renderCart();
}

// ---------- CLEAR CART ----------
const clearCartBtn = document.getElementById('clear-cart');
clearCartBtn?.addEventListener('click', () => {
  cart = [];
  localStorage.removeItem('cart');
  location.reload();
});

// ---------- CHECKOUT MODAL ----------
const checkoutModal = document.getElementById('checkoutModal');
const openCheckout = document.getElementById('openCheckout');
const closeModal = document.querySelector('.close-modal');

if (openCheckout) {
  openCheckout.addEventListener('click', () => {
    loadOrderSummary();
    checkoutModal.classList.add('active');
  });
}

closeModal?.addEventListener('click', () => {
  checkoutModal.classList.remove('active');
});

window.addEventListener('click', (e) => {
  if (e.target === checkoutModal) checkoutModal.classList.remove('active');
});

// ---------- ORDER SUMMARY ----------
function loadOrderSummary() {
  const summaryContainer = document.querySelector('.summary-items');
  const totalContainer = document.querySelector('.summary-total');
  if (!summaryContainer) return;

  if (cart.length === 0) {
    summaryContainer.innerHTML = '<p>Your cart is empty.</p>';
    totalContainer.textContent = '';
    return;
  }

  summaryContainer.innerHTML = '';
  let total = 0;
  cart.forEach(item => {
    total += item.price;
    const p = document.createElement('p');
    p.innerHTML = `<span>${item.name}</span><span>₦${item.price.toLocaleString()}</span>`;
    summaryContainer.appendChild(p);
  });
  totalContainer.textContent = `Total: ₦${total.toLocaleString()}`;
}

// ---------- CONFIRM ORDER ----------
const confirmOrder = document.getElementById('confirmOrder');
confirmOrder?.addEventListener('click', () => {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  if (!name || !phone) return alert('Please fill in your name and phone number.');

  let message = `*New Order from Harold's Furniture*\n\n`;
  cart.forEach(item => {
    message += `${item.name} - ₦${item.price.toLocaleString()}\n`;
  });
  const total = cart.reduce((a, b) => a + b.price, 0);
  message += `\n*Total:* ₦${total.toLocaleString()}\n\n👤 Name: ${name}\n📞 Phone: ${phone}`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/2348131636146?text=${encoded}`, '_blank');

  localStorage.removeItem('cart');
  updateCartCount();
});
