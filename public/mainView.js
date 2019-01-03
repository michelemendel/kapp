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

    infoModalEventHandler();
    searchEventHandler(db, productsRootNode, showids);
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
function searchEventHandler(db, productsRootNode, showids) {
    const input = document.getElementById("searchInput");
    input.addEventListener("keyup", function (e) {
        e.preventDefault();
        if (e.keyCode === 13) {
            products.removeProducts(productsRootNode);
            products.displayProducts(
                productsRootNode,
                displayCount(db.search(input.value)),
                showids
            );
        }
    });
}

function infoModalEventHandler() {
    const infoModalButton = document.getElementById("info_modal__open");
    var modal = document.getElementById('info_modal');
    // Get the <span> element that closes the modal
    var infoModalClose = document.getElementsByClassName("info_modal__close")[0];

    infoModalButton.onclick = () => {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    infoModalClose.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}