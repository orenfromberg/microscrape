const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const store_codes = require('./stores.json');
const products_urls = require('./products.json');

const scrape_inventory = html => {
    const dom = new JSDOM(html);
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

const fetch_inventory = (axios, url, store_code) => {
    return axios({
        method: 'get',
        url: url,
        headers: {
            "Accept": "text/html",
            "Cache-Control": "max-age=0",
            "Cookie": `storeSelected=${store_code}`
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
}

module.exports = {
    store_codes,
    products_urls,
    scrape_inventory,
    get_inventory,
    fetch_inventory,
}