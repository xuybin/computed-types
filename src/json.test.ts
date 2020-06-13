import 'mocha';
import { assert } from 'chai';
import json from './json';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('json', () => {
  it('json()', () => {
    const empty = {};
    const fooObj = { foo: 1 };
    const arr: unknown[] = [];
    const fooArr = ['foo'];

    assert.equal(json(empty), empty);
    assert.equal(json(fooObj), fooObj);
    assert.equal(json(arr), arr);
    assert.equal(json(fooArr), fooArr);

    assert.throws(() => json(null as any), TypeError);
    assert.throws(() => json(0 as any), TypeError);
    assert.throws(() => json(1 as any), TypeError);
    assert.throws(() => json('hello' as any), TypeError);
    assert.throws(() => json(true as any), TypeError);
    assert.throws(() => json(false as any), TypeError);
    assert.throws(() => json(Symbol('test') as any), TypeError);
    assert.throws(() => json(undefined as any), TypeError);
  });
});
