const {
    products_urls,
    fetch_inventory,
    store_codes
} = require('./microcenter');
const axios = require('axios');

const check_inventory = url => {
    return fetch_inventory(axios, url, store_codes["Rockville, MD"])
}

// check inventory of one item in one location
// check_inventory(products_urls[1]).then(values => console.log(values));

// check inventory for all products in one location
// const promises = products_urls.map(check_inventory)
// Promise.all(promises).then(values => console.log(values))

// check inventory for one item in all locations
const promises = Object.keys(store_codes).map(location => {
    return fetch_inventory(axios, products_urls[1], store_codes[location])
})
Promise.all(promises)
.then(values => values.filter(value => value.inventory != '0'))
.then(values => console.log(values));