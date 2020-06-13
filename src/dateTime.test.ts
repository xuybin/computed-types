import 'mocha';
import { assert } from 'chai';
import dateTime from './dateTime';

/* eslint-disable @typescript-eslint/no-explicit-any */

describe('dateTime', () => {
  it('dateTime()', () => {
    assert.equal(dateTime('2020-03-01 12:30:15'), '2020-03-01 12:30:15');

    assert.throws(() => dateTime('2020-3-1 12:30:15'), TypeError);
    assert.throws(() => dateTime('2020-02-31 12:30:15'), TypeError);
    assert.throws(() => dateTime('2020-02-31'), TypeError);
    assert.throws(() => dateTime('12:30:15'), TypeError);
  });

  it('.after()', () => {
    assert.equal(
      dateTime.after('2020-03-01 12:30:15')('2020-05-01 12:30:15'),
      '2020-05-01 12:30:15',
    );
    assert.throws(
      () => dateTime.after('2020-03-01 12:30:15')('2020-02-01 12:30:15'),
      RangeError,
    );
  });

  it('.before()', () => {
    assert.equal(
      dateTime.before('2020-03-01 12:30:15')('2020-01-01 12:30:15'),
      '2020-01-01 12:30:15',
    );
    assert.throws(
      () => dateTime.before('2020-03-01 12:30:15')('2020-04-01 12:30:15'),
      RangeError,
    );
  });

  it('.afterNow()', () => {
    assert.equal(
      dateTime.afterNow(-60 * 60 * 24 * 360)('2020-05-01 12:30:15'),
      '2020-05-01 12:30:15',
    );
    assert.throws(
      () => dateTime.afterNow(-60 * 60 * 24 * 360)('2019-06-01 12:30:15'),
      RangeError,
    );
  });

  it('.beforeNow()', () => {
    assert.equal(
      dateTime.beforeNow(-60 * 60 * 24 * 360)('2019-01-01 12:30:15'),
      '2019-01-01 12:30:15',
    );
    assert.throws(
      () => dateTime.beforeNow(-60 * 60 * 24 * 360)('2020-04-01 12:30:15'),
      RangeError,
    );
  });
});
