var assert = require('assert');
const fs = require('fs');

const { 
    get_inventory,
    scrape_inventory
 } = require('../microcenter');

describe('microcenter', function () {
    describe('scrape_inventory()', () => {
        it('Can scrape the inventory with a good response', () => {
            fs.readFile('./test/response.txt', (err, text) => {
                if (err) throw err;
                assert.equal(scrape_inventory(text), 12);
              });
        })

        it('Can throw an error with a bad response', () => {
            fs.readFile('./test/bad_response.txt', (err, text) => {
                if (err) throw err;
                assert.throws(() => scrape_inventory(text), Error, /can't select class .inventory/);
              });
        })

    })
    describe('get_inventory()', () => {
        it('Can handle various text content', () => {
            const text_contents = [
                '12 NEW IN STOCK at Rockville Store - Buy In Store',
                '0 NEW IN STOCK at Rockville Store',
                'SOLD OUT at Rockville Store',
                '10 NEW IN STOCK at Rockville Store Located In DIY►VIEW MAP'
            ]

            assert.deepEqual(
                text_contents.map(text => {
                    const quantity = get_inventory(text);
                    console.debug(`DEBUG: got ${quantity} from \"${text}\"`)
                    return quantity;
                }),
                [12, 0, 0, 10]
            );
        });

        it('Can throw an error when the text content does not conform', () => {
            assert.throws(() => get_inventory("foo"), Error, /regexes did not match text/)
        })
    });
});
