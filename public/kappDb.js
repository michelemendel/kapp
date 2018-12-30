const search_cols = ["category", "sub_category", "producer", "product_type", "product", "kosher_type", "kosher_stamp", "comment"];

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

function database() {
    let products = [];

    const initFirestoreDb = (fs) => {
        console.log("Initializing Firestore");
        return fs.collection("products").get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    products.push(doc.data())
                });
            })
            .then(() => {
                return true;
            });
    }

    const initLocalDb = () => {
        console.log("Initializing local database");
        products = records;
        return Promise.resolve(true);
    }

    const getProducts = () => {
        return products;
    }

    const search = (str) => {
        const re = RegExp(str + ".*", "ui");
        return products.filter((p) => {

            for (col of search_cols) {
                // Without the normalize method, search for the letter å doesn't work.
                if (re.test(p[col]) || re.test(p[col].normalize())) {
                    return true;
                }
            }

            return false;
        });
    }

    return {
        initFirestoreDb,
        initLocalDb,
        getProducts,
        search,
    }

}