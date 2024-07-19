/* eslint-disable @typescript-eslint/no-floating-promises */

import { describe, it } from 'node:test';
import * as utils from '../common/utils.js';
import assert from 'node:assert';
import { ContentType } from '../common/types.js';

describe('test of the utils functions', () => {
    describe('isJSON', () => {
        it('return true for valid JSON string', () => {
            const validJSON = JSON.stringify({ object: { with: ['nested', { properties: true }] }, and: { numbers: 10 } });
            assert.ok(utils.isJSON(validJSON));
        });

        it('return false for other strings', () => {
            const notValidJSON = 'not json';
            assert.ok(!utils.isJSON(notValidJSON));
        });
    });

    describe('removeTrailingSlash', () => {
        it('return / when path is /', () => {
            const path = utils.removeTrailingSlash('/');
            assert.strictEqual(path, '/');
        });

        it('return the same path if it doesnt end with /', () => {
            const path = utils.removeTrailingSlash('/a/b');
            assert.strictEqual(path, '/a/b');
        });

        it('return the path whitout end / otherwise', () => {
            const path = utils.removeTrailingSlash('/a/b/');
            assert.strictEqual(path, '/a/b');
        });
    });

    describe('parseRequestMethod', () => {
        it('return GET, POST, PATCH or DELETE', () => {
            for (const method of ['GET', 'POST', 'PATCH', 'DELETE']) {
                assert.strictEqual(method, utils.parseRequestMethod(method));
            }
        });

        it('return ANY for other values', () => {
            assert.strictEqual('ANY', utils.parseRequestMethod('not an http method'));
        });
    });

    describe('getContentType', () => {
        it('return OctetStream for buffers', () => {
            const buf = Buffer.from('');
            assert.strictEqual(ContentType.OctetStream, utils.getContentType(buf));
        });

        it('return JSON for JSON strings', () => {
            const JSONString = JSON.stringify({ object: { with: ['nested', { properties: true }] }, and: { numbers: 10 } });
            assert.strictEqual(ContentType.JSON, utils.getContentType(JSONString));
        });

        it('return Text for other strings', () => {
            const str = 'some content';
            assert.strictEqual(ContentType.Text, utils.getContentType(str));
        });
    });

    describe('matchPaths', () => {
        it('match normal paths', () => {
            const handlerPath = '/api';
            const requestPath = '/api/users';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('match multiple depth', () => {
            const handlerPath = '/app/easter-egg';
            const requestPath = '/app/easter-egg';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('not match if handler path is longer', () => {
            const handlerPath = '/things/random';
            const requestPath = '/things';
            assert.ok(!utils.matchPaths(requestPath, handlerPath));
        });

        it('match if handler path is *', () => {
            const handlerPath = '/app/*';
            const requestPath = '/app/lolipop';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });

        it('match with path params', () => {
            const handlerPath = '/users/:id/profile';
            const requestPath = '/users/092834/profile';
            assert.ok(utils.matchPaths(requestPath, handlerPath));
        });
    });

    describe('cleanPath', () => {
        it('clean the current path', () => {
            const currentPath = '/app/users/8887463/profile';
            const handlerPath = '/app';
            const cleanedPath = '/users/8887463/profile';
            assert.strictEqual(utils.cleanPath(handlerPath, currentPath), cleanedPath);
        });

        it('return / if the paths are equal', () => {
            const currentPath = '/home';
            const handlerPath = '/home';
            assert.strictEqual(utils.cleanPath(handlerPath, currentPath), '/');
        });
    });

    describe('populateRequestParams', () => {
        it('return an empty object if no params', () => {
            const currentPath = '/home/infos';
            const routePath = '/home/infos';
            assert.deepStrictEqual(utils.populateRequestParams(currentPath, routePath), {});
        });

        it('return corresponding params', () => {
            const currentPath = '/api/users/john/pictures/1234';
            const routePath = '/api/users/:username/pictures/:picId';
            const expected = {
                username: 'john',
                picId: '1234'
            };
            assert.deepStrictEqual(utils.populateRequestParams(currentPath, routePath), expected);
        });
    });

    describe('parseCookieHeader', () => {
        it('parse the cookie header', () => {
            const cookieHeader = 'name=value; token=12345';
            const expected = {
                name: 'value',
                token: '12345'
            };
            assert.deepStrictEqual(utils.parseCookieHeader(cookieHeader), expected);
        });
    });

    describe('getCookieHeaderValue', () => {
        it('turn a cookie object into Set-Cookie header value', () => {
            const cookieName = 'token';
            const cookie = {
                value: 's3Cr€TvA1uE',
                attributes: {
                    secure: true,
                    httpOnly: true,
                    maxAge: 10000
                }
            };
            const expected = 'token=s3Cr€TvA1uE; Secure; Http-Only; Max-Age=10000';
            assert.equal(utils.getCookieHeaderValue(cookieName, cookie), expected);
        });
    });
});
