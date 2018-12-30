/**
 * Product List
 */

function displaySearchBar(searchBarRootNode, productsRootNode, db) {
    searchBarRootNode.innerHTML = `
        <div class="searchBar">
            <input id="searchInput" type="text" placeholder="Search...">
            <span id="product_count" class="info"></span>
        </div>
    `
    displayCount = (products) => {
        document.querySelector("#product_count").innerHTML = products.length;
        return products;
    };

    displayProducts(
        productsRootNode,
        displayCount(db.getProducts())
    );

    // Execute a function when the user releases a key on the keyboard
    const input = document.getElementById("searchInput");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            removeProducts(productsRootNode);
            displayProducts(
                productsRootNode,
                displayCount(db.search(input.value))
            );
        }
    });
}

/**
 * Product List
 */

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
    return products;
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

const display_cols = {
    "category": "Category",
    "sub_category": "Sub Category",
    "producer": "Producer",
    "product": "Product",
    "kosher_type": "Kosher Type",
    "kosher_stamp": "Kosher Stamp",
    "product_type": "Product Type",
    "comment": "Comment",
    // 
    "cat_sub_cat": "Category/SubCat"
};

const kosher_type_lookup = {
    "-": "-",
    "p": "parve",
    "m": "melk",
    "mprod": "ikke melk, produsert i melk-utstyr",
    "ik": "ikke kosher",
};

function createProductItemNodes(product) {
    const prodList = {
        "cat_sub_cat": product["category"] + "/" + product["sub_category"],
        "producer": product["producer"],
        "product": product["product"],
        "kosher_type": kosher_type_lookup[product["kosher_type"]],
        "kosher_stamp": product["kosher_stamp"],
        "product_type": product["product_type"],
        "comment": product["comment"],
    };

    return Object.keys(prodList).map((key) => {
        contentKeyNode = document.createElement("div");
        contentKeyNode.classList.add("contentKey");
        contentKeyNode.appendChild(createContentNode(display_cols[key]))

        contentValueNode = document.createElement("div");
        contentValueNode.classList.add("contentValue");
        contentValueNode.appendChild(createContentNode(prodList[key]))

        productItemNode = document.createElement("div");
        productItemNode.classList.add("productItem");
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