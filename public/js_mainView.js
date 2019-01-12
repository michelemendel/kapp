import * as products from "./js_productsView.js";

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
    input.setAttribute("class", "main__searchBar__searchInput");
    input.setAttribute("id", "main__searchBar__searchInput");
    input.setAttribute("type", "text");
    input.setAttribute("placeholder", "Search...");

    const count = document.createElement("span");
    count.setAttribute("id", "main__searchBar__product_count");
    count.setAttribute("class", "main__searchBar__info");

    searchBarRootNode.appendChild(input);
    searchBarRootNode.appendChild(count);
}

function displayCount(products) {
    document.querySelector("#main__searchBar__product_count").textContent = products.length;
    return products;
}

/** 
 * Execute search when the user releases a key on the keyboard.
 */
function searchEventHandler(db, productsRootNode, showids) {
    const search = document.getElementById("main__searchBar__searchInput");

    const displaySearchResult = () => {
        products.removeProducts(productsRootNode);
        products.displayProducts(
            productsRootNode,
            displayCount(db.search(search.value)),
            showids
        );
    };

    search.addEventListener("keyup", function (e) {
        if (e.key === "Enter") {
            // This trigger the focusout event and eventually the search.
            e.target.blur();
        }
    });

    document.addEventListener("focusout", function (e) {
        console.log("focusout", e);
        displaySearchResult();
    });
}

function infoModalEventHandler() {
    const infoModalButton = document.getElementById("info_modal__open");
    var modal = document.getElementById("info_modal");
    var body = document.getElementsByTagName("body")[0];
    // Get the <span> element that closes the modal
    var infoModalClose = document.getElementsByClassName("info_modal__close")[0];

    infoModalButton.onclick = () => {
        modal.style.display = "block";
        body.setAttribute("style", "overflow:hidden");
    }

    // When the user clicks on <span> (x), close the modal
    infoModalClose.onclick = function () {
        modal.style.display = "none";
        body.setAttribute("style", "overflow:auto");
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}