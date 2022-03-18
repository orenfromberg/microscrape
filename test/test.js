var assert = require('assert');
const fs = require('fs');
const fsPromises = fs.promises;
const { it } = require('mocha');
const axios = require('axios');
const moxios = require('moxios');
const store_codes = require('../stores.json');
const products_urls = require('../products.json');
const sinon = require('sinon');

const {
    get_inventory,
    scrape_inventory,
    fetch_inventory
} = require('../microcenter');

describe('microcenter', function () {
    describe('fetch_inventory()', () => {
        beforeEach(function () {
            moxios.install()
        });

        afterEach(function () {
            moxios.uninstall()
        });

        // it('Succeeds upon a 200 response with a good response object', (done) => {
        //     fsPromises.readFile('./test/response.txt').then((text) => {
        //         moxios.withMock(function () {
        //             let onFulfilled = sinon.spy()
        //             fetch_inventory(axios, products_urls[0], store_codes["Rockville, MD"]).then(onFulfilled)

        //             moxios.wait(function () {
        //                 let request = moxios.requests.mostRecent()
        //                 request.respondWith({
        //                     status: 200,
        //                     response: {
        //                         data: text
        //                     }
        //                 })
        //                     .then(function () {
        //                         equal(onFulfilled.called, true)
        //                         done()
        //                     })
        //             })
        //         })
        //     })
        //     .catch(error => {
        //         console.error(error);
        //     })
        // });

        it('Throws an error upon a 200 response with a bad response object', (done) => {
            moxios.stubRequest(products_urls[0], {
                status: 200,
            });

            let onFulfilled = sinon.spy();
            fetch_inventory(axios, products_urls[0], store_codes["Rockville, MD"])
                .catch(onFulfilled);

            moxios.wait(() => {
                assert.match(
                    onFulfilled.getCall(0).args[0].toString(),
                    /response object is bad/
                );
                done();
            });
        });

        it('Throws an error upon a 301 response', (done) => {
            moxios.stubRequest(products_urls[0], {
                status: 301,
            });

            let onFulfilled = sinon.spy();
            fetch_inventory(axios, products_urls[0], store_codes["Rockville, MD"])
                .catch(onFulfilled);

            moxios.wait(() => {
                assert.match(
                    onFulfilled.getCall(0).args[0].toString(),
                    /Request failed with status code 301/
                );
                done();
            });
        });

        it('Throws an error upon a 400 response', (done) => {
            moxios.stubRequest(products_urls[0], {
                status: 400,
            });

            let onFulfilled = sinon.spy();
            fetch_inventory(axios, products_urls[0], store_codes["Rockville, MD"])
                .catch(onFulfilled);

            moxios.wait(() => {
                assert.match(
                    onFulfilled.getCall(0).args[0].toString(),
                    /Request failed with status code 400/
                );
                done();
            });
        });

        it('Throws an error upon a 500 response', (done) => {
            moxios.stubRequest(products_urls[0], {
                status: 500,
            });

            let onFulfilled = sinon.spy();
            fetch_inventory(axios, products_urls[0], store_codes["Rockville, MD"])
                .catch(onFulfilled);

            moxios.wait(() => {
                assert.match(
                    onFulfilled.getCall(0).args[0].toString(),
                    /Request failed with status code 500/
                );
                done();
            });
        });
    });
    describe('scrape_inventory()', () => {
        it('Can scrape the inventory with a good response', () => {
            fs.readFile('./test/response.txt', (err, text) => {
                if (err) throw err;
                assert.equal(scrape_inventory(text), 12);
            });
        });

        it('Can throw an error with a bad response', () => {
            fs.readFile('./test/bad_response.txt', (err, text) => {
                if (err) throw err;
                assert.throws(() => scrape_inventory(text), Error, /can't select class .inventory/);
            });
        });

    });
    describe('get_inventory()', () => {
        it('Can handle various text content', () => {
            const text_contents = [
                '12 NEW IN STOCK at Rockville Store - Buy In Store',
                '0 NEW IN STOCK at Rockville Store',
                '25+ NEW IN STOCK at Houston Store Located In Aisle 28►VIEW MAP',
                'SOLD OUT at Rockville Store',
                '10 NEW IN STOCK at Rockville Store Located In DIY►VIEW MAP'
            ];

            assert.deepEqual(
                text_contents.map(text => {
                    const quantity = get_inventory(text);
                    console.debug(`DEBUG: got ${quantity} from \"${text}\"`)
                    return quantity;
                }),
                ["12", "0", "25+", "0", "10"]
            );
        });

        it('Can throw an error when the text content does not conform', () => {
            assert.throws(() => get_inventory("foo"), Error, /regexes did not match text/)
        });
    });
});
