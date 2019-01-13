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

    const search = (str) => {
        const re = RegExp(str + ".*", "im");
        return products.filter((p) => {
            // Without the normalize method, search for the letter å doesn't work.
            return re.test(p["search"].normalize());
        });
    };

    return {
        initLocalDb,
        getProducts,
        search,
    }

}