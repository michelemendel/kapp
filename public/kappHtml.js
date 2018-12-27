const display_cols = ["product", "kosher_type", "kosher_stamp", "category", "sub_category", "producer", "product_type", "comment"];

function displayProduct(productRootNode, product) {
    productRootNode.appendChild(
        createProductNode(product)
    )
}

function displayProducts(productsRootNode, products) {
    createProductNodes(products).forEach((productNode) => {
        productsRootNode.appendChild(productNode);
        // horLineNode = document.createElement("hr");
        // productsRootNode.appendChild(horLineNode);
    });
}

function createProductNodes(products) {
    return products.map((product) => {
        return createProductNode(product);
    });
}

function createProductNode(product) {
    productNode = document.createElement("div");
    productNode.classList.add("product");
    createProductItemNodes(product).forEach((productItemNode) => {
        productNode.appendChild(productItemNode);
    });
    return productNode;
}

function createProductItemNodes(product) {
    return display_cols.map((key) => {
        productItemNode = document.createElement("div");
        productItemNode.classList.add("productItem");

        contentKeyNode = document.createElement("div");
        contentKeyNode.classList.add("contentKey");
        contentKeyNode.appendChild(createContentNode(key))

        contentValueNode = document.createElement("div");
        contentValueNode.classList.add("contentValue");
        contentValueNode.appendChild(createContentNode(product[key]))

        productItemNode.appendChild(contentKeyNode);
        productItemNode.appendChild(contentValueNode);
        return productItemNode;
    });
}

function createContentNode(content) {
    contentNode = document.createTextNode(content);
    return contentNode;
}

function removeProducts(productsRootNode) {
    while (productsRootNode.firstChild) {
        productsRootNode.removeChild(productsRootNode.firstChild);
    }
}

function displaySearchBar(searchBarRootNode, productsRootNode, db) {
    searchBarRootNode.innerHTML = `
        <div class="searchBar">
            <input id="searchInput" type="text" placeholder="Search..">
        </div>
    `
    const input = document.getElementById("searchInput");

    // Execute a function when the user releases a key on the keyboard
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            const res = db.search(input.value);
            console.log("Search result", res);
            removeProducts(productsRootNode);
            displayProducts(productsRootNode, res);
        }
    });
}