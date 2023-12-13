import { describe, it } from 'node:test'
import * as utils from '../lib/utils.js';
import assert from 'node:assert';
import { ContentType } from '../lib/types.js';

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
           assert.strictEqual(path, '/'); 
        });

        it('should return the same path if it doesnt end with /', () => {
            let path = utils.removeTrailingSlash('/a/b');
            assert.strictEqual(path, '/a/b');
        });

        it('should return the path whitout end / otherwise', () => {
            let path = utils.removeTrailingSlash('/a/b/');
            assert.strictEqual(path, '/a/b');
        });
    });

    describe('parseRequestMethod', () => {
        it('should return GET, POST, PATCH or DELETE', () => {
            for (let method of ['GET', 'POST', 'PATCH', 'DELETE']) {
                assert.strictEqual(method, utils.parseRequestMethod(method));
            }
        });

        it('should return ANY for other values', () => {
           assert.strictEqual('ANY', utils.parseRequestMethod('not an http method')); 
        });
    });

    describe('getContentType', () => {
        it('should return OctetStream for buffers', () => {
            let buf = Buffer.from('');
            assert.strictEqual(ContentType.OctetStream, utils.getContentType(buf));
        });

        it('should return JSON for JSON strings', () => {
            let JSONString = JSON.stringify({ object: { with: ['nested', { properties: true }] }, and: { numbers: 10 } });
            assert.strictEqual(ContentType.JSON, utils.getContentType(JSONString));
        });

        it('should return Text for other strings', () => {
            let str = 'some content';
            assert.strictEqual(ContentType.Text, utils.getContentType(str));
        });
    });

    describe('matchPaths', () => {
        it('should match normal paths', () => {
            let handlerPath = '/api';
            let requestPath = '/api/users';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('should match multiple depth', () => {
            let handlerPath = '/app/easter-egg';
            let requestPath = '/app/easter-egg';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('should not match if handler path is longer', () => {
            let handlerPath = '/things/random';
            let requestPath = '/things';
            assert.ok(!utils.matchPaths(requestPath, handlerPath));
        });

        it('should match if handler path is *', () => {
            let handlerPath = '/app/*';
            let requestPath = '/app/lolipop';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('should match with path params', () => {
            let handlerPath = '/users/:id/profile';
            let requestPath = '/users/092834/profile';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });
    });
});