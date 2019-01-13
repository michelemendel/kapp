export function init(data) {
    let products = [];

    const initLocalDb = () => {
        console.log("Initializing local database");
        products = data['records'];
        return Promise.resolve(true);
    };

    const getProducts = (uid = 0) => {
        return uid == 0 ?
            products :
            products.filter((p) => {
                return p["uid"] == uid;
            });
    };

    const search = (searchVals) => {
        return searchMultiplePredicate(searchVals, products);
    };

    return {
        initLocalDb,
        getProducts,
        search,
    }
}

/**
 * Splits the search string in words and returns true if all words match (logical AND match).
 */
function searchMultiplePredicate(searchVals, products) {
    const res = searchVals.split(" ").map((val) => RegExp(val + ".*", "im"));

    return products.filter((product) => {
        return res.reduce((acc, re) => {
            // Without the normalize method, search for the letter å doesn't work.
            return acc && re.test(product["search"].normalize());
        }, true);
    });
}