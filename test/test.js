var assert = require('assert');
const { get_inventory } = require('../microcenter');

const text_contents = [
    '12 NEW IN STOCK at Rockville Store - Buy In Store',
    '0 NEW IN STOCK at Rockville Store',
    'SOLD OUT at Rockville Store',
    '10 NEW IN STOCK at Rockville Store Located In DIY►VIEW MAP'
]

describe('microscrape', function () {
    describe('get_inventory', () => {
        it('Can handle various text content', () => {
            assert.deepEqual(
                text_contents.map(text => (get_inventory(text))),
                [12, 0, 0, 10]
            );
        });
    });
});
