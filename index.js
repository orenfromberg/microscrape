const {
    products_urls,
    fetch_inventory,
    store_codes
} = require('./microcenter');
const axios = require('axios');

const fetch_inventory_in_rockville = url => {
    return fetch_inventory(axios, url, store_codes["Rockville, MD"])
}

// const promises = products_urls.map(fetch_inventory_in_rockville)

// Promise.all(promises).then(values => console.log(values))

fetch_inventory_in_rockville(products_urls[0]).then(values => console.log(values));