const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

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
    const dom = new JSDOM(html);
    const result = dom.window.document.querySelector(".inventory");
    return (result ? result.textContent.trim() : "OUT OF STOCK");
}

const fetch_inventory = (url, store_code) => {
    const options = {
        "headers": {
            "Accept": "text/html",
            "Cache-Control": "max-age=0",
            "Cookie": `storeSelected=${store_code}`
        },
        "method": "GET",
    }
    return fetch(url, options)
        .then(response => (response.blob()))
        .then(blob => (blob.text()))
        .then(html => {
            return ({
                url,
                store_code,
                date: new Date(),
                inventory: scrape_inventory(html)
            })
        })
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

Promise.all(products_urls.map(url => (fetch_inventory_with_random_delay(url, store_codes["Rockville, MD"])))).then(values => console.log(values))
