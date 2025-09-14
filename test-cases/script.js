// SECURITY VULNERABILITY: Hardcoded API key (intentional for testing)
const API_KEY = 'sk-1234567890abcdef-PRODUCTION-KEY';

// Shopping cart array
let cart = [];

// VULNERABILITY: Price is read directly from editable DOM element
function addToCart(id, name) {
    // Get the price from the editable DOM element - user can change this!
    const priceElement = document.querySelector(`[data-id="${id}"] .price-value`);
    const price = parseFloat(priceElement.textContent) || 0;

    const item = {
        id: id,
        name: name,
        price: price,
        quantity: 1
    };
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push(item);
    }
    
    updateCartDisplay();
    
    // Simulate API call with exposed key
    console.log('Sending request with API key:', API_KEY);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalSpan = document.getElementById('cart-total');

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty</p>';
        // Don't overwrite if user has edited the total
        if (cartTotalSpan.textContent === '0.00' || cartTotalSpan.textContent === '') {
            cartTotalSpan.textContent = '0.00';
        }
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach(item => {
        html += `
            <div class="cart-item">
                <div>
                    <span class="cart-item-name">${item.name}</span>
                    <span> x ${item.quantity}</span>
                </div>
                <div>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        total += item.price * item.quantity;
    });

    cartItemsDiv.innerHTML = html;
    // Only update total if user hasn't manually edited it
    if (!document.activeElement || document.activeElement.id !== 'cart-total') {
        cartTotalSpan.textContent = total.toFixed(2);
    }
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // MAJOR VULNERABILITY: Total is read from editable DOM element!
    const cartTotalSpan = document.getElementById('cart-total');
    const total = parseFloat(cartTotalSpan.textContent) || 0;

    // Simulate payment processing with exposed API key
    const paymentData = {
        apiKey: API_KEY,
        items: cart,
        total: total  // User can edit this to any value!
    };

    // In real app, this would be a server call
    console.log('Processing payment with data:', paymentData);

    alert(`Order placed! Total: $${total.toFixed(2)}\nThank you for your purchase!`);

    // Clear cart
    cart = [];
    updateCartDisplay();
}

// Developer console helper (another vulnerability)
window.updatePrice = function(itemId, newPrice) {
    // This function allows price manipulation from console
    const priceElements = document.querySelectorAll(`[data-id="${itemId}"] .price-value`);
    priceElements.forEach(el => {
        el.textContent = newPrice.toFixed(2);
    });
    
    // Update the onclick handler with new price
    const button = document.querySelector(`[data-id="${itemId}"] .add-to-cart`);
    const itemName = document.querySelector(`[data-id="${itemId}"] h3`).textContent;
    button.setAttribute('onclick', `addToCart(${itemId}, '${itemName}', ${newPrice})`);
    
    console.log(`Price updated for item ${itemId} to $${newPrice}`);
};

// Initialize cart display
updateCartDisplay();