import * as products from "./productsView.js";

export function init(db, uid = 0, showids = false) {
    const productsRootNode = document.getElementById("products");
    const searchBarRootNode = document.getElementById("searchBar");

    displaySearch(searchBarRootNode);

    products.displayProducts(
        productsRootNode,
        displayCount(db.getProducts(uid)),
        showids
    );

    initEventHandlers(db, productsRootNode, showids);
}

function displaySearch(searchBarRootNode) {
    const input = document.createElement("input");
    input.setAttribute("class", "searchInput");
    input.setAttribute("id", "searchInput");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Search...");

    const count = document.createElement("span");
    count.setAttribute("id", "product_count");
    count.setAttribute("class", "info");

    searchBarRootNode.appendChild(input);
    searchBarRootNode.appendChild(count);
}

function displayCount(products) {
    document.querySelector("#product_count").textContent = products.length;
    return products;
}

/** 
 * Execute search when the user releases a key on the keyboard.
 */
function initEventHandlers(db, productsRootNode, showids) {
    const input = document.getElementById("searchInput");
    input.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.keyCode === 13) {
            products.removeProducts(productsRootNode);
            products.displayProducts(
                productsRootNode,
                displayCount(db.search(input.value)),
                showids
            );
        }
    });
}