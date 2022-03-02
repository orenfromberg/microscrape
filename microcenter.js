const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const axios = require('axios');

const store_codes = {
    "Tustin, CA": "101",
    "Rockville, MD": "085"
}

const products_urls = [
    "https://www.microcenter.com/product/632771/raspberry-pi-pico-microcontroller-development-board",
    "https://www.microcenter.com/product/643085/raspberry-pi-zero-2-w",
    "https://www.microcenter.com/product/609038/raspberry-pi-4-model-b-4gb-ddr4",
    "https://www.microcenter.com/product/622539/pi4modelB8gb",
    "https://www.microcenter.com/product/633751/raspberry-pi-400-includes-raspbery-pi-400-with-4gb-ram,-micro-sd-card-slot,-2-usb-30-ports,-1-usb-20-port,-usb-c-power-required",
    "https://www.microcenter.com/product/631204/raspberry-pi-400-personal-computer-kit"
]

const scrape_inventory = html => {
    const dom = new JSDOM(html); // TODO handle any thrown errors
    const result = dom.window.document.querySelector(".inventory");
    if (!result) {
        throw new Error("can't select class .inventory");
    } else {
        return get_inventory(result.textContent.trim());
    }
}

const get_inventory = text => {
    const in_stock = /(?<quantity>\d+) NEW IN STOCK/mg;
    const sold_out = /SOLD OUT/mg;

    const match = in_stock.exec(text);
    if (match) {
        return parseInt(match.groups.quantity);
    } else if (sold_out.exec(text)) {
        return 0;
    } else {
        throw new Error("regexes did not match text");
    }
}

const fetch_inventory = (url, store_code) => {
    return axios({
        method: 'get',
        url: products_urls[0],
        headers: {
            "Accept": "text/html",
            "Cache-Control": "max-age=0",
            "Cookie": `storeSelected=${store_codes["Rockville, MD"]}`
        }
    })
    .then(response => {
        if (response && response.data) {
            return response.data
        } else {
            throw new Error("response object is bad")
        }
    })
    .then(html => ({
        url,
        store_code,
        date: new Date(),
        inventory: scrape_inventory(html)
    }))
    .catch(handle_request_error);
}

const handle_request_error = error => {
    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
}

const delay = (t, v) => {
    return new Promise(resolve => {
        setTimeout(resolve.bind(null, v), t)
    });
}

const fetch_inventory_with_random_delay = (url, store) => {
    const random_delay = Math.random() * 10000;
    return delay(random_delay).then(() => fetch_inventory(url, store))
}

module.exports = {
    store_codes,
    products_urls,
    scrape_inventory,
    get_inventory,
    fetch_inventory,
    fetch_inventory_with_random_delay
}