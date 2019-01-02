export function displayProduct(productRootNode, product) {
    productRootNode.appendChild(
        createProductNode(product)
    )
}

export function displayProducts(productsRootNode, products, showids = false) {
    createProductNodes(products, showids).forEach((productNode) => {
        productsRootNode.appendChild(productNode);
    });
    return products;
}

function createProductNodes(products, showids) {
    return products.map((product) => {
        return createProductNode(product, showids);
    });
}

function createProductNode(product, showids = false) {
    const productNode = document.createElement("div");
    productNode.classList.add("product");
    createProductItemNodes(product, showids).forEach((productItemNode) => {
        productNode.appendChild(productItemNode);
    });
    return productNode;
}

const kosher_type_lookup = {
    "-": "-",
    "p": "parve",
    "m": "melk",
    "mprod": "Ikke melk, men produsert i melke-utstyr",
    "ik": "ikke kosher",
};

const display_cols = {
    uid: "uid",
    category: "Category",
    sub_category: "Sub Category",
    producer: "Producer",
    product: "Product",
    kosher_type: "Kosher Type",
    kosher_stamp: "Kosher Stamp",
    product_type: "Product Type",
    comment: "Comment",
    // 
    cat_sub_cat: "Category/Subcat",
    kosher_type_stamp: "Kosher",
};

function createProductItemNodes(product, showids = false) {
    const prodList = {
        uid: showids ? product["uid"].toString() : "-",
        category: product["sub_category"] !== "-" ? "-" : product["category"],
        cat_sub_cat: product["sub_category"] !== "-" ? product["category"] + "/" + product["sub_category"] : "-",
        producer: product["producer"],
        product_type: product["product_type"],
        product: product["product"],
        kosher_type_stamp: kosher_type_lookup[product["kosher_type"]] + (product["kosher_stamp"] !== "-" ? " (" + product["kosher_stamp"] + ")" : ""),
        comment: product["comment"],
    };

    return Object.keys(prodList)
        .filter((key) => prodList[key].trim() !== "-")
        .map((key) => {
            const contentKeyNode = document.createElement("div");
            contentKeyNode.classList.add("contentKey");
            contentKeyNode.appendChild(createContentNode(display_cols[key]))

            const contentValueNode = document.createElement("div");
            contentValueNode.classList.add("contentValue");
            contentValueNode.appendChild(createContentNode(prodList[key]))

            const productItemNode = document.createElement("div");
            productItemNode.classList.add("productItem");
            productItemNode.appendChild(contentKeyNode);
            productItemNode.appendChild(contentValueNode);
            return productItemNode;
        });
}

function createContentNode(content) {
    const contentNode = document.createTextNode(content);
    return contentNode;
}

export function removeProducts(productsRootNode) {
    while (productsRootNode.firstChild) {
        productsRootNode.removeChild(productsRootNode.firstChild);
    }
}