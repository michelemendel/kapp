const display_cols = ["category", "sub_category", "producer", "product", "kosher_type", "kosher_stamp", "comment"];
const search_cols = ["category", "sub_category", "producer", "product", "kosher_type", "kosher_stamp", "comment"];

function getProductsTest() {
    return [{
            product: "bread",
            kosher_type: "M*",
            producer: "Toro",
        },
        {
            product: "tortilla",
            kosher_type: "P",
            producer: "The Mexican"
        },
    ];
}

function initFirebase() {
    const config = {
        apiKey: "AIzaSyDnPZyNb6IlpqRv5HqNqufj3Osc1pHlQMg",
        authDomain: "kappdb-6fb1e.firebaseapp.com",
        databaseURL: "https://kappdb-6fb1e.firebaseio.com",
        projectId: "kappdb-6fb1e",
        storageBucket: "kappdb-6fb1e.appspot.com",
        messagingSenderId: "577134652655"
    };

    firebase.initializeApp(config);

    // Initialize Cloud Firestore through Firebase
    const db = firebase.firestore();

    // Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    });

    return db;
}

function database() {
    const products = [];

    const initDb = () => {
        return fbDb.collection("products").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    products.push(doc.data())
                });
            })
            .then(() => {
                return true;
            });
    }

    const getProducts = () => {
        return products;
    }

    const search = (str) => {
        const re = RegExp(".*" + str.toLowerCase() + ".*");
        return products.filter((p) => {
            for (col of search_cols) {
                if (re.test(p[col].toLowerCase())) {
                    return true;
                }
            }
            return false;
        });
    }

    return {
        initDb,
        getProducts,
        search,
    }

}

function displayProduct(productRootNode, product) {
    productRootNode.appendChild(
        createProductNode(product)
    )
}

function displayProducts(productsRootNode, products) {
    createProductNodes(products).forEach((productNode) => {
        productsRootNode.appendChild(productNode);
        horLineNode = document.createElement("hr");
        productsRootNode.appendChild(horLineNode);
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
        contentNode = createContentNode(product[key])
        productItemNode = document.createElement("div");
        productItemNode.classList.add("productItem");
        productItemNode.appendChild(createContentNode(key + ": " + product[key]));
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