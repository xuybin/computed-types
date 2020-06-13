import 'mocha';
import { assert } from 'chai';
import int from './int';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('int', () => {
  it('int()', () => {
    assert.equal(int(123), 123);
    assert.equal(int(0), 0);
    assert.equal(int(-3), -3);
    assert.equal(int(int.MAX_VALUE), int.MAX_VALUE);
    assert.equal(int(int.MIN_VALUE), int.MIN_VALUE);

    assert.throws(() => int(undefined as any), TypeError);
    assert.throws(() => int(null as any), TypeError);
    assert.throws(() => int(NaN), TypeError);
    assert.throws(() => int(Number.POSITIVE_INFINITY), TypeError);
    assert.throws(() => int(1.23), TypeError);
    assert.throws(() => int(-1.23), TypeError);
    assert.throws(() => int('12.3' as any), TypeError);
    assert.throws(() => int('hello' as any), TypeError);
  });

  it('.toLocaleString()', () => {
    assert.equal(int.toLocaleString()(1234), '1,234');
    assert.equal(int.toLocaleString('en-US')(1234), '1,234');
  });

  it('.toString()', () => {
    assert.equal(int.toString()(123), '123');
    assert.equal(int.toString(16)(123), '7b');
  });

  it('.min()', () => {
    assert.equal(int.min(3)(3), 3);
    assert.equal(int.min(3)(4), 4);

    assert.throw(() => int.min(3)(2.9), TypeError);
    assert.throw(() => int.min(3)(NaN), TypeError);
    assert.throw(() => int.min(3)(3.5), TypeError);
    assert.throw(() => int.min(3)(null as any), TypeError);
    assert.throw(() => int.min(3, 'test')(1), TypeError, 'test');
  });

  it('.max()', () => {
    assert.equal(int.max(3)(3), 3);
    assert.equal(int.max(3)(2), 2);

    assert.throw(() => int.max(3)(4.1), TypeError);
    assert.throw(() => int.max(3)(NaN), TypeError);
    assert.throw(() => int.max(3)(3.5), TypeError);
    assert.throw(() => int.max(3)(null as any), TypeError);
    assert.throw(() => int.max(3, 'test')(6), TypeError, 'test');
  });

  it('.gte()', () => {
    assert.equal(int.gte(3)(3), 3);
    assert.equal(int.gte(3)(4), 4);

    assert.throw(() => int.gte(3)(3.5), TypeError);
    assert.throw(() => int.gte(3)(2.9), TypeError);
  });

  it('.lte()', () => {
    assert.equal(int.lte(3)(3), 3);
    assert.equal(int.lte(3)(2), 2);

    assert.throw(() => int.lte(3)(2.9), TypeError);
    assert.throw(() => int.lte(3)(3.1), TypeError);
  });

  it('.gt()', () => {
    assert.equal(int.gt(3)(4), 4);

    assert.throw(() => int.gt(3)(3), RangeError);
    assert.throw(() => int.gt(3)(NaN), TypeError);
    assert.throw(() => int.gt(3)(2.9), TypeError);
    assert.throw(() => int.lte(3)(3.9), TypeError);
    assert.throw(() => int.gt(3, 'test')(2), TypeError, 'test');
  });

  it('.lt()', () => {
    assert.equal(int.lt(3)(2), 2);

    assert.throw(() => int.lt(3)(3), RangeError);
    assert.throw(() => int.lt(3)(NaN), TypeError);
    assert.throw(() => int.lt(3)(3.1), TypeError);
    assert.throw(() => int.lt(3)(2.9), TypeError);
    assert.throw(() => int.lt(3, 'test')(4), TypeError, 'test');
  });

  it('.between()', () => {
    assert.equal(int.between(1, 3)(1), 1);
    assert.equal(int.between(1, 3)(2), 2);
    assert.equal(int.between(1, 3)(3), 3);

    assert.throw(() => int.between(1, 3)(0.9), TypeError);
    assert.throw(() => int.between(1, 3)(3.1), TypeError);
    assert.throw(() => int.between(1, 3)(NaN), TypeError);
    assert.throw(() => int.between(1, 3, 'test')(5), TypeError, 'test');
  });
});
