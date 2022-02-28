const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const store_codes = {
    "Rockville, MD": "085"
}

const products = {
    "pico": "https://www.microcenter.com/product/632771/raspberry-pi-pico-microcontroller-development-board",
    "zero": "https://www.microcenter.com/product/643085/raspberry-pi-zero-2-w"
}

fetch(products["pico"], {
        // "credentials": "include",
        "headers": {
            // "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0",
            // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept": "text/html",
            // "Accept-Language": "en-US,en;q=0.5",
            // "Upgrade-Insecure-Requests": "1",
            // "Sec-Fetch-Dest": "document",
            // "Sec-Fetch-Mode": "navigate",
            // "Sec-Fetch-Site": "same-origin",
            "Cache-Control": "max-age=0",
            // "Cookie": "asusSP=; myStore=false; rpp=24; ut=MjE3NTk1ODk3OTIyNDgwMA==; isOnWeb=False; asusSP=; isMobile=false; flixgvid=flixed9e5c45000000.63733762; storeSelected=085; SortBy=match; rearview=643085,632771; viewtype=grid; T632771=UmFzcGJlcnJ5IFBpIFBpY28gTWljcm9jb250cm9sbGVyIERldmVsb3BtZW50IEJvYXJk; S632771=223214; T643085=UmFzcGJlcnJ5IFBpIFplcm8gMiBX; S643085=334904"
            "Cookie": `storeSelected=${store_codes["Rockville, MD"]}`
        },
        // "referrer": "https://www.microcenter.com/search/search_results.aspx?Ntk=all&sortby=match&N=4294910344+4294819333&myStore=false",
        "method": "GET",
        // "mode": "cors"
    })
    .then(response => (response.blob()))
    .then(blob => (blob.text()))
    .then(html => {
        const dom = new JSDOM(html);
        const result = dom.window.document.querySelector("span.inventoryCnt");
        if (result !== null) {
            console.log(result.textContent)
        } else {
            console.log("OUT OF STOCK")
        }
        // console.log(dom.window.document.querySelector("span.inventoryCnt"));
        // console.log(html)
    })