const {
    products_urls,
    fetch_inventory,
    store_codes
} = require('./microcenter');
const axios = require('axios');

const check_inventory = url => {
    return fetch_inventory(axios, url, store_codes["Brentwood, MO"])
}

// const promises = products_urls.map(check_inventory)

// Promise.all(promises).then(values => console.log(values))

check_inventory(products_urls[0]).then(values => console.log(values));