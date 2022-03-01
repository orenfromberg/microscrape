const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fetch = require('node-fetch');

const store_codes = {
    "Tustin, CA": "101",
    "Rockville, MD": "085"
}

const products = {
    "raspberry-pi-pico-microcontroller-development-board": "https://www.microcenter.com/product/632771/raspberry-pi-pico-microcontroller-development-board",
    "raspberry-pi-zero-2-w": "https://www.microcenter.com/product/643085/raspberry-pi-zero-2-w",
    "raspberry-pi-4-model-b-4gb-ddr4": "https://www.microcenter.com/product/609038/raspberry-pi-4-model-b-4gb-ddr4",
    "raspberry-pi-400-includes-raspbery-pi-400-with-4gb-ram,-micro-sd-card-slot,-2-usb-30-ports,-1-usb-20-port,-usb-c-power-required": "https://www.microcenter.com/product/633751/raspberry-pi-400-includes-raspbery-pi-400-with-4gb-ram,-micro-sd-card-slot,-2-usb-30-ports,-1-usb-20-port,-usb-c-power-required",
    "raspberry-pi-400-personal-computer-kit": "https://www.microcenter.com/product/631204/raspberry-pi-400-personal-computer-kit"
}

const scrape_inventory = html => {
    const dom = new JSDOM(html);
    const result = dom.window.document.querySelector(".inventory");
    return (result ? result.textContent.trim() : "OUT OF STOCK");
}

const check_inventory = (product, location) => {
    const options = {
        "headers": {
            "Accept": "text/html",
            "Cache-Control": "max-age=0",
            "Cookie": `storeSelected=${store_codes[location]}`
        },
        "method": "GET",
    }
    return fetch(products[product], options)
        .then(response => (response.blob()))
        .then(blob => (blob.text()))
        .then(html => {
            return ({
                product,
                location,
                date: new Date(),
                inventory: scrape_inventory(html)
            })
        })
}

Promise.all(Object.keys(products).map(product => (check_inventory(product, "Rockville, MD")))).then(values => console.log(values))