import { describe, it } from 'node:test'
import * as utils from '../lib/utils.js';
import assert from 'node:assert';

describe('test of the utils functions', t => {
    describe('isJSON', () => {
        it('sould return true for valid JSON string', t => {
            let validJSON = JSON.stringify({ object: { with: ['nested', { properties: true }] }, and: { numbers: 10 } });
            assert.ok(utils.isJSON(validJSON));
        });
        it('sould return false for other strings', () => {
            let notValidJSON = 'not json';
            assert.ok(!utils.isJSON(notValidJSON));
        });
    });
});