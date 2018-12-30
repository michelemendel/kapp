// const search_cols = ["search", "category", "sub_category", "producer", "product_type", "product", "kosher_type", "kosher_stamp", "comment"];

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
    };

    const initLocalDb = () => {
        console.log("Initializing local database");
        products = data['records'];
        return Promise.resolve(true);
    };

    const getProducts = () => {
        return products;
    };

    const search = (str) => {
        const re = RegExp(str + ".*", "im");
        return products.filter((p) => {
            // Without the normalize method, search for the letter å doesn't work.
            return re.test(p["search"].normalize());
        });
    };

    return {
        initFirestoreDb,
        initLocalDb,
        getProducts,
        search,
    }

}