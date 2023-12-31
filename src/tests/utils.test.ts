import { describe, it } from 'node:test'
import * as utils from '../lib/utils.js';
import assert from 'node:assert';
import { ContentType } from '../lib/types.js';

describe('test of the utils functions', () => {
    describe('isJSON', () => {
        it('return true for valid JSON string', () => {
            let validJSON = JSON.stringify({ object: { with: ['nested', { properties: true }] }, and: { numbers: 10 } });
            assert.ok(utils.isJSON(validJSON));
        });

        it('return false for other strings', () => {
            let notValidJSON = 'not json';
            assert.ok(!utils.isJSON(notValidJSON));
        });
    });

    describe('removeTrailingSlash', () => {
        it('return / when path is /', () => {
           let path = utils.removeTrailingSlash('/');
           assert.strictEqual(path, '/'); 
        });

        it('return the same path if it doesnt end with /', () => {
            let path = utils.removeTrailingSlash('/a/b');
            assert.strictEqual(path, '/a/b');
        });

        it('return the path whitout end / otherwise', () => {
            let path = utils.removeTrailingSlash('/a/b/');
            assert.strictEqual(path, '/a/b');
        });
    });

    describe('parseRequestMethod', () => {
        it('return GET, POST, PATCH or DELETE', () => {
            for (let method of ['GET', 'POST', 'PATCH', 'DELETE']) {
                assert.strictEqual(method, utils.parseRequestMethod(method));
            }
        });

        it('return ANY for other values', () => {
           assert.strictEqual('ANY', utils.parseRequestMethod('not an http method')); 
        });
    });

    describe('getContentType', () => {
        it('return OctetStream for buffers', () => {
            let buf = Buffer.from('');
            assert.strictEqual(ContentType.OctetStream, utils.getContentType(buf));
        });

        it('return JSON for JSON strings', () => {
            let JSONString = JSON.stringify({ object: { with: ['nested', { properties: true }] }, and: { numbers: 10 } });
            assert.strictEqual(ContentType.JSON, utils.getContentType(JSONString));
        });

        it('return Text for other strings', () => {
            let str = 'some content';
            assert.strictEqual(ContentType.Text, utils.getContentType(str));
        });
    });

    describe('matchPaths', () => {
        it('match normal paths', () => {
            let handlerPath = '/api';
            let requestPath = '/api/users';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('match multiple depth', () => {
            let handlerPath = '/app/easter-egg';
            let requestPath = '/app/easter-egg';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('not match if handler path is longer', () => {
            let handlerPath = '/things/random';
            let requestPath = '/things';
            assert.ok(!utils.matchPaths(requestPath, handlerPath));
        });

        it('match if handler path is *', () => {
            let handlerPath = '/app/*';
            let requestPath = '/app/lolipop';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('match with path params', () => {
            let handlerPath = '/users/:id/profile';
            let requestPath = '/users/092834/profile';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });
    });

    describe('cleanPath', () => {
        it('clean the current path', () => {
            let currentPath = '/app/users/8887463/profile';
            let handlerPath = '/app';
            let cleanedPath = '/users/8887463/profile';
            assert.strictEqual(utils.cleanPath(handlerPath, currentPath), cleanedPath);
        });

        it('return / if the paths are equal', () => {
            let currentPath = '/home';
            let handlerPath = '/home';
            assert.strictEqual(utils.cleanPath(handlerPath, currentPath), '/');
        });
    });

    describe('populateRequestParams', () => {
        it('return an empty object if no params', () => {
            let currentPath = '/home/infos';
            let routePath = '/home/infos';
            assert.deepStrictEqual(utils.populateRequestParams(currentPath, routePath), {});
        });

        it('return corresponding params', () => {
            let currentPath = '/api/users/john/pictures/1234';
            let routePath = '/api/users/:username/pictures/:picId';
            let expected = {
                username: 'john',
                picId: '1234'
            }
            assert.deepStrictEqual(utils.populateRequestParams(currentPath, routePath), expected);
        });
    });

    describe('parseCookieHeader', () => {
        it('parse the cookie header', () => {
            let cookieHeader = 'name=value; token=12345';
            let expected = {
                name: 'value',
                token: '12345'
            }
            assert.deepStrictEqual(utils.parseCookieHeader(cookieHeader), expected);
        });
    });

    describe('getCookieHeaderValue', () => {
        it('turn a cookie object into Set-Cookie header value', () => {
            let cookieName = 'token';
            let cookie = {
                value: 's3Cr€TvA1uE',
                attributes: {
                    secure: true,
                    httpOnly: true,
                    maxAge: 10000
                }
            }
            let expected = 'token=s3Cr€TvA1uE; Secure; Http-Only; Max-Age=10000';
            assert.equal(utils.getCookieHeaderValue(cookieName, cookie), expected);
        });
    });
});