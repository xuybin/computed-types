import 'mocha';
import { assert } from 'chai';
import float, { FLOAT_MAX_VALUE, FLOAT_MIN_VALUE } from './float';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('float', () => {
  it('.float()', () => {
    assert.equal(float(123), 123);
    assert.equal(float(12.3), 12.3);
    assert.equal(float(-12.3), -12.3);
    assert.equal(float(0), 0);
    assert.equal(float(Number.EPSILON), Number.EPSILON);
    assert.equal(float(FLOAT_MAX_VALUE), FLOAT_MAX_VALUE);
    assert.equal(float(FLOAT_MIN_VALUE), FLOAT_MIN_VALUE);

    assert.throws(() => float(NaN), TypeError);
    assert.throws(() => float(Number.POSITIVE_INFINITY), TypeError);
    assert.throws(() => float(Number.NEGATIVE_INFINITY), TypeError);
    assert.throws(() => float('12.3' as any), TypeError);
  });

  it('.toExponential()', () => {
    assert.equal(float.toExponential()(1234), '1.234e+3');
  });

  it('.toExponential().toUpperCase()', () => {
    assert.equal(float.toExponential().toUpperCase()(1234), '1.234E+3');
  });

  it('.toFixed()', () => {
    assert.equal(float.toFixed(1)(12.34), '12.3');
  });

  it('.toLocaleString()', () => {
    assert.equal(float.toLocaleString()(1234), '1,234');
    assert.equal(float.toLocaleString('en-US')(1234), '1,234');
  });

  it('.toPrecision()', () => {
    assert.equal(float.toPrecision()(123.456), '123.456');
    assert.equal(float.toPrecision(2)(123.456), '1.2e+2');
    assert.equal(float.toPrecision(3)(123.456), '123');
  });

  it('.toString()', () => {
    assert.equal(float.toString()(123.456), '123.456');
    assert.equal(float.toString(16)(123.456), '7b.74bc6a7ef9dc');
  });

  it('.min()', () => {
    assert.equal(float.min(3)(3), 3);
    assert.equal(float.min(3)(3.5), 3.5);

    assert.throw(() => float.min(3)(2.9), RangeError);
    assert.throw(() => float.min(3)(NaN), TypeError);
    assert.throw(() => float.min(3)(null as any), TypeError);
    assert.throw(() => float.min(3, 'test')(1), TypeError, 'test');
  });

  it('.max()', () => {
    assert.equal(float.max(3)(3), 3);
    assert.equal(float.max(3)(2.9), 2.9);

    assert.throw(() => float.max(3)(4.1), RangeError);
    assert.throw(() => float.max(3)(NaN), TypeError);
    assert.throw(() => float.max(3)(null as any), TypeError);
    assert.throw(() => float.max(3, 'test')(6), TypeError, 'test');
  });

  it('.gte()', () => {
    assert.equal(float.gte(3)(3), 3);
    assert.equal(float.gte(3)(3.1), 3.1);

    assert.throw(() => float.gte(3)(2.9), RangeError);
  });

  it('.lte()', () => {
    assert.equal(float.lte(3)(3), 3);
    assert.equal(float.lte(3)(2.9), 2.9);

    assert.throw(() => float.lte(3)(3.1), RangeError);
  });

  it('.gt()', () => {
    assert.equal(float.gt(3)(3.1), 3.1);

    assert.throw(() => float.gt(3)(3), RangeError);
    assert.throw(() => float.gt(3)(NaN), TypeError);
    assert.throw(() => float.gt(3)(2.9), RangeError);
    assert.throw(() => float.gt(3, 'test')(2), TypeError, 'test');
  });

  it('.lt()', () => {
    assert.equal(float.lt(3)(2.9), 2.9);

    assert.throw(() => float.lt(3)(3), RangeError);
    assert.throw(() => float.lt(3)(NaN), TypeError);
    assert.throw(() => float.lt(3)(3.1), RangeError);
    assert.throw(() => float.lt(3, 'test')(4), TypeError, 'test');
  });

  it('.between()', () => {
    assert.equal(float.between(1, 3)(1), 1);
    assert.equal(float.between(1, 3)(1.5), 1.5);
    assert.equal(float.between(1, 3)(3), 3);

    assert.throw(() => float.between(1, 3)(0.9), RangeError);
    assert.throw(() => float.between(1, 3)(3.1), RangeError);
    assert.throw(() => float.between(1, 3)(NaN), TypeError);
    assert.throw(() => float.between(1, 3, 'test')(5), TypeError, 'test');
  });
});
