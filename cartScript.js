const productsInCart = document.getElementById("productsInCart");
const cartFooter = document.getElementById("cartFooter");
const tableBody = document.getElementById("cartTableBody");
const cartProducts = []
createCartDisplay();

function clearCartAfterOrder() {
    localStorage.removeItem('cart');
    productsInCart.innerHTML = ''
    const emptyCard = `
            <div class="row">
                <div class="col">
                    <p class="informEmpty" id="emptyId"> Your order is on its way! Order details and confirmation has been sent to your email. </p>
                </div>
            </div>`;
    productsInCart.innerHTML += emptyCard;
}

function createCartDisplay() {
    cartFooter.innerHTML = '';
    cartProducts.length = 0;
    const allProducts = JSON.parse(localStorage.getItem('cart'));
    tableBody.innerHTML = '';
    if (allProducts && allProducts?.length) {
        getCart(allProducts);
    }
    else {
        getEmptyCart();
    }
}
function getCart(allProducts) {
    allProducts.forEach(product => {
        cartProducts.push(product);
        let quantity = product.quantity;
        if (!quantity || quantity == 0) {
            quantity = 1;
        }
        product.quantity = quantity;
        const row = document.createElement("tr");
        const increaseQ = document.createElement("button");
        increaseQ.type = "button";
        increaseQ.className = "btn m-1 increaseQ";
        increaseQ.innerHTML = "&#8963";
        increaseQ.addEventListener('click', (e) => {
            increaseQuantity(product, e);
        });
        const decreaseQ = document.createElement("button");
        decreaseQ.type = "button";
        decreaseQ.className = "btn m-1 decreaseQ";
        decreaseQ.innerHTML = "&#8964";
        decreaseQ.addEventListener('click', (e) => {
            decreseQuantity(product, e);
        });
        const removeFromCart = document.createElement("button");
        removeFromCart.type = "button";
        removeFromCart.className = "btn m-1 removeFromCart";
        removeFromCart.id = "removeCartButton";
        removeFromCart.innerHTML = "&#10006";
        removeFromCart.addEventListener('click', () => {
            removeProductFromCart(product);
        });
        const price = (Number(product.price) * Number(quantity)).toFixed(2);
        row.innerHTML =
            `<td><img src="${product.image}" width="50"></td>
                <td>${product.title}
                <br>
                ${product.price}€
                </td>
                <td class="totalPrice">${price}€</td>
                <td class="quantityValue">${quantity}</td>`;
        row.appendChild(increaseQ);
        row.appendChild(decreaseQ);
        row.appendChild(removeFromCart);
        tableBody.appendChild(row);
    });
    getCartFooter(cartProducts);
}
function getCartFooter(cartProducts) {
    const totalSum = Number(getTotalSum(cartProducts)).toFixed(2);
    const footer = document.getElementById("cartFooter");
   footer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center flex-wrap">
            <div class="sum-info-card d-flex align-items-center gap-4">
                <h4 class="mb-0">Total sum:</h4>
                <p class="totalSum mb-0" id="sValue">${totalSum}€</p>
            </div>
            <div id="checkOutCol" class="checkoutButtons"></div>
        </div>`;
    cartFooter.innerHTML += footer;
    const goToOrder = document.createElement("button");
    goToOrder.type = "button";
    goToOrder.className = "btn m-1 goToOrder";

    goToOrder.id = "checkoutButton";
    goToOrder.innerHTML = "Proceed to checkout";
    goToOrder.addEventListener('click', () => {
        showOrderPopup();
    });
    const eraseCart = document.createElement("button");
    eraseCart.type = "button";
    eraseCart.className = "btn m-1 eraseCart";
    eraseCart.id = "eraseCartButton";
    eraseCart.innerHTML = "Remove all items";
    eraseCart.addEventListener('click', () => {
        localStorage.removeItem("cart");
        getEmptyCart();
    });
    const checkOutCol = document.getElementById("checkOutCol");
    checkOutCol.appendChild(goToOrder);
    checkOutCol.append(eraseCart);
}

function increaseQuantity(product, event) {
    const oldQuantity = Number(product.quantity);
    const newQuantity = oldQuantity + 1;
    product.quantity = newQuantity;
    adjustQuantity(product, newQuantity, event);
}
function decreseQuantity(product, event) {
    const oldQuantity = Number(product.quantity);
    const newQuantity = oldQuantity - 1;
    product.quantity = newQuantity;
    if (newQuantity <= 0) {
        removeProductFromCart(product);
    } else {
        adjustQuantity(product, newQuantity, event);
    }
}
function removeProductFromCart(product) {
    const oldCart = JSON.parse(localStorage.getItem('cart'));
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(oldCart.filter(p => p.id != product.id)));
    createCartDisplay();
}
function adjustQuantity(product, quantity, event) {
    const row = event.target.closest("tr");
    const qValue = row.querySelector(".quantityValue");
    const pValue = row.querySelector(".totalPrice");
    const sValue = document.getElementById("sValue");
    qValue.innerHTML = `${quantity}`;
    const totalValue = getTotalSum(cartProducts);
    sValue.innerHTML = `${totalValue}`;
    const totalProductPrice = getTotalProductPrice(product, quantity);
    pValue.innerHTML = `${totalProductPrice}`;
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cartProducts));
}

function getTotalProductPrice(product, quantity) {
    const price = product.price * quantity;
    return price.toFixed(2);
}
function getEmptyCart() {
    productsInCart.innerHTML = ''
    const emptyCard = `
            <div class="row">
                <div class="col">
                    <p class="informEmpty" id="emptyId"> You haven't added anything to the cart yet. </p>
                </div>
            </div>`;
    productsInCart.innerHTML += emptyCard;
}
function getTotalSum(cartProducts) {
    let totalSum = 0;
    cartProducts.forEach(product => { totalSum += (Number(product.price) * Number(product.quantity)) });
    return totalSum.toFixed(2);
}
function getSingleProduct(productId) {
    const res = fetch('https://dummyjson.com/products/' + productId)
    const thisProduct = res.json();
    return thisProduct;
}