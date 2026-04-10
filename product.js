// get id from url
const urlParams = new URLSearchParams(window.location.search);
const productId = Number(urlParams.get('id'));
const cartButton = document.getElementById("cartSymbol")
cartButton.addEventListener('click', () => {
    window.location.href = 'Cart.html'
});
getProduct();

async function getProduct() {
    res = await fetch('https://dummyjson.com/products/' + productId);
    const product = await res.json();
    console.log(product);

    // dynamically update browser tab
    document.title = `${product.title} - Arctic Store`;

    // inject html
    document.getElementById('single-product-container').innerHTML = `
        <div class="product-card">
            <div class="product-card-header">
                <h2>${product.title}</h2>
            </div>
            <div class="product-card-body">
                <img src="${product.images[0]}" alt="${product.title}">
                <p class="price">${product.price}€</p>
                <p class="description">${product.description}</p>
                <p class="quantityBox">
                How many would you like to order? 
                <input type = "Number" id = "quantityInput" min ="0" max="10">
                </p>
                <button type="button" class="btn btn-primary" id="order-btn">Add to cart</button>
            </div>
        </div>`;

    const orderBtn = document.getElementById('order-btn');
    orderBtn.addEventListener('click', () => {
        const q = document.getElementById("quantityInput")
        const quantityInput = q.value.trim();
        const cartItem = {
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: quantityInput
        };
        if (quantityInput != null && Number(quantityInput) > 0) {
            showConfirmation(cartItem);
            addToCart(cartItem);
            const modal = new bootstrap.Modal(document.getElementById('myModal'));
            modal.show();
        }
    });
}

function showConfirmation(product) {
    const modBod = document.getElementById("modalBody");
    modBod.innerHTML = `
        ${product.quantity} x ${product.title}`;
}
function addToCart(cartItem) {
    const currentCart = JSON.parse(localStorage.getItem('cart'))
    if (!currentCart || currentCart.length === 0) {
        localStorage.setItem('cart', JSON.stringify([cartItem]));
    }
    else {
        const newCart = []
        let exists = false;
        currentCart.forEach(product => {
            if (product.id === cartItem.id) {
                const newQuantity = Number(product.quantity) + Number(cartItem.quantity);
                product.quantity = newQuantity;
                exists = true;
            }
            newCart.push(product);
        });
        if (!exists) {
            newCart.push(cartItem)
        }
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify(newCart));
    }
}