document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.getElementById("productGrid");
    const categoryBar = document.getElementById("allCategoryButtons");
    const cartButton = document.getElementById("cartSymbol")
    let currentCategories = [];
    let activeCatButton = undefined;

    cartButton.addEventListener('click', () => {
        window.location.href = 'Cart.html'
    });
    getCategoryButtons(["all"]);
    showProducts('all');

    function getCategoryButtons(headCat) {
        if (headCat[0] === "all") {
            getHeadCategories();
        }
        else {
            getSubCategories(headCat);
        }
    }
    function getSubCategories(cat) {
        let bottom = false;
        let subCategories = []
        if (cat === "menswear") {
            subCategories = ["mens-shirts", "mens-shoes", "mens-watches",]
        }
        else if (cat === "womenswear") {
            subCategories = ["womens-bags", "womens-dresses", "womens-jewellery", "womens-shoes", "womens-watches"]
        }
        else if (cat === "electronics") {
            subCategories = ["laptops", "mobile-accessories", "smartphones", "tablets"]
        }
        else if (cat === "accessories") {
            subCategories = ["mens-watches", "mobile-accessories", "sports-accessories", "sunglasses", "womens-bags", "womens-jewellery", "womens-watches"]
        }
        else if (cat === "beauty") {
            subCategories = ["skin-care", "fragrances",]
        }
        else if (cat === "groceries") {
            subCategories = ["groceries"]
        }
        else if (cat === "home decoration") {
            subCategories = ["home-decoration", "kitchen-accessories",]
        }
        else if (cat === "vehicles") {
            subCategories = ["motorcycle"]
        }
        if (subCategories.length === 0) {
            bottom = true;
            currentCategories.forEach(c => {
                subCategories.push(c);
            });
        }
        currentCategories = subCategories;
        if (bottom) {
            subCategories.push("bottomLevel")
        }
        showCategories(subCategories, false);
        return subCategories;
    }
    function getHeadCategories(catResult) {
        const headCats = ["menswear", "womenswear", "electronics", "accessories", "groceries", "home decoration", "vehicles"];
        currentCategories = headCats;
        activeCatButton = undefined;
        showCategories(headCats, true);
    }
    function showCategories(categories, head) {
        categoryBar.innerHTML = '';
        categories.forEach(cat => {
            if (cat != "bottomLevel") {
                const catButton = document.createElement('button');
                catButton.type = "button";
                catButton.className = "btn m-1 catButton";

                if (activeCatButton != undefined) {
                    const activeCatButtonText = activeCatButton.textContent.replace(" ", "-");
                    if (cat == activeCatButtonText) {
                        catButton.className = "btn m-1 activeCatButton";
                    }
                }
                const buttonText = cat.replace("-", " ");
                catButton.textContent = buttonText;
                catButton.addEventListener('click', () => {
                    activeCatButton = catButton;
                    const functText = buttonText.replace(" ", "-");
                    showProducts(functText);
                    getCategoryButtons(functText);
                });
                categoryBar.appendChild(catButton);
            }
        });
        if (!head) {
            categoryBar.appendChild(getAllButton());
        }
    }
    function getAllButton() {
        const catButton = document.createElement('button');
        catButton.type = "button";
        catButton.className = "btn m-1 catButton";
        catButton.textContent = 'all';
        catButton.addEventListener('click', () => {
            getHeadCategories();
            showProducts('all')
            activeCatButton = undefined;
        });
        return catButton;
    }

    function showProducts(category) {
        if (category == 'all') {
            const catLink = 'https://dummyjson.com/products';
            fetchProduct(catLink);
        }
        else {
            const subCats = getSubCategories(category);
            let bottom = false;
            subCats.forEach(s => {
                if (s === "bottomLevel") {
                    bottom = true;
                }
            })
            if (bottom) {
                const catLink = 'https://dummyjson.com/products/category/' + category;
                fetchProduct(catLink);
            }
            else {
                subCats.forEach(subCat => {
                    const catLink = 'https://dummyjson.com/products/category/' + subCat;
                    fetchProduct(catLink);
                });
            }
        }
    }
    async function fetchProduct(catLink) {
        productGrid.innerHTML = '';
        let subset = [];
        await fetch(catLink)
            .then(res => res.json())
            .then((resProducts) => {
                const productsInSubCat = resProducts.products;
                if (subset.length === 0) {
                    subset = productsInSubCat;
                }
                else {
                    productsInSubCat.forEach(product => {
                        let exists = false;
                        subset.forEach(element => {
                            if (element.id === product.id) {
                                exists = true;
                            }
                        });
                        if (!exists) {
                            subset.push(product);
                        }
                    })
                }
                subset.forEach(product => {
                    const card = `
                <div class="col">
                    <a href="product.html?id=${product.id}" class="grid-card-link">
                        <div class="grid-card">
                            <div class="grid-card-header">
                                <h3>${product.title}</h3>
                            </div>
                            <img src="${product.images[0]}" class="grid-card-img-top img-fluid"></img>
                            <div class="grid-card-body">
                                <p class="grid-card-price">${product.price}€</p>
                                <button class="grid-button">
                                    Order
                                </button>
                            </div>
                        </div>
                    </a>
                </div>`;
                    productGrid.innerHTML += card;
                });
                return subset;
            })
    }
});