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

    describe('removeTrailingSlash', () => {
        it('sould return / when path is /', () => {
           let path = utils.removeTrailingSlash('/');
           assert.equal(path, '/'); 
        });

        it('should return the same path if it doesnt end with /', () => {
            let path = utils.removeTrailingSlash('/a/b');
            assert.equal(path, '/a/b');
        });

        it('should return the path whitout end / otherwise', () => {
            let path = utils.removeTrailingSlash('/a/b/');
            assert.equal(path, '/a/b');
        });
    });

    describe('parseRequestMethod', () => {
        it('should return GET, POST, PATCH or DELETE', () => {
            for (let method of ['GET', 'POST', 'PATCH', 'DELETE']) {
                assert.equal(method, utils.parseRequestMethod(method));
            }
        });

        it('should return ANY for other values', () => {
           assert.equal('ANY', utils.parseRequestMethod('not an http method')); 
        });
    });
});