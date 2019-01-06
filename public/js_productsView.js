import * as C from "./js_constants.js";

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
    productNode.classList.add("main__products__product");
    createProductItemNodes(product, showids).forEach((productItemNode) => {
        productNode.appendChild(productItemNode);
    });
    return productNode;
}

function setKosherClass(product, contentValueNode) {
    if (product["kosher_type"] === C.KOSHER_TYPE.TREIF) {
        contentValueNode.classList.add("main__products__product__productItem__contentValue--treif");
    } else if (product["kosher_type"] === C.KOSHER_TYPE.PARVE) {
        contentValueNode.classList.add("main__products__product__productItem__contentValue--parve");
    } else if (product["kosher_type"] === C.KOSHER_TYPE.MILK) {
        contentValueNode.classList.add("main__products__product__productItem__contentValue--milk");
    }
}

function setProductClass(key, contentValueNode) {
    if (key === C.KEYS.PRODUCT) {
        contentValueNode.classList.add("main__products__product__productItem__contentValue--product");
    }
}

function createProductItemNodes(product, showids = false) {
    const prodList = {
        uid: showids ? product[C.KEYS.UID].toString() : "-",
        category: product[C.KEYS.SUB_CATEGORY] !== "-" ? "-" : product[C.KEYS.CATEGORY],
        cat_sub_cat: product[C.KEYS.SUB_CATEGORY] !== "-" ? product[C.KEYS.CATEGORY] + "/" + product[C.KEYS.SUB_CATEGORY] : "-",
        producer: product[C.KEYS.PRODUCER],
        product_type: product[C.KEYS.PRODUCT_TYPE],
        product: product[C.KEYS.PRODUCT],
        kosher_type_stamp: C.KOSHER_TYPE_LOOKUP[product[C.KEYS.KOSHER_TYPE]] + (product[C.KEYS.KOSHER_STAMP] !== "-" ? " (" + product[C.KEYS.KOSHER_STAMP] + ")" : ""),
        comment: product[C.KEYS.COMMENT],
    };

    return Object.keys(prodList)
        .filter((key) => prodList[key].trim() !== "-")
        .map((key) => {
            const contentKeyNode = document.createElement("div");
            contentKeyNode.classList.add("main__products__product__productItem__contentKey");
            contentKeyNode.appendChild(createContentNode(C.DISPLAY_COLS[key]))

            const contentValueNode = document.createElement("div");
            contentValueNode.classList.add("main__products__product__productItem__contentValue");
            contentValueNode.appendChild(createContentNode(prodList[key]))
            setKosherClass(product, contentValueNode);
            setProductClass(key, contentValueNode);

            const productItemNode = document.createElement("div");
            productItemNode.classList.add("main__products__product__productItem");
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