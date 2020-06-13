import Validator, { ValidatorProxy } from './Validator';
import { StringValidator } from './string';
import { ErrorLike } from './schema/errors';
import FunctionType, { FunctionParameters } from './schema/FunctionType';
import { type } from './schema/validations';

export const FLOAT_MIN_VALUE = new Number('-3.402823466E+38').valueOf();
export const FLOAT_MAX_VALUE = new Number('3.402823466E+38').valueOf();

export class FloatValidator<
  P extends FunctionParameters = [number]
> extends Validator<FunctionType<number, P>> {
  public toExponential(
    ...args: Parameters<number['toExponential']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform((val) => val.toExponential(...args), StringValidator);
  }

  public toFixed(
    ...args: Parameters<number['toFixed']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform((val) => val.toFixed(...args), StringValidator);
  }

  public toLocaleString(
    ...args: Parameters<number['toLocaleString']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform(
      (val) => val.toLocaleString(...args),
      StringValidator,
    );
  }

  public toPrecision(
    ...args: Parameters<number['toPrecision']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform((val) => val.toPrecision(...args), StringValidator);
  }

  public toString(
    ...args: Parameters<number['toString']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform((val) => val.toString(...args), StringValidator);
  }

  public min(min: number, error?: ErrorLike<[number]>): ValidatorProxy<this> {
    if (!Number.isFinite(min)) {
      throw new Error(`Expect value to be a float "min(${min})"`);
    }
    return this.test(
      (val) => val >= min,
      error ||
        ((val: number): RangeError =>
          new RangeError(
            `Expect value to be greater or equal than ${min} (actual: ${val})`,
          )),
    );
  }

  public max(max: number, error?: ErrorLike<[number]>): ValidatorProxy<this> {
    if (!Number.isFinite(max)) {
      throw new Error(`Expect value to be a float "max(${max})"`);
    }
    return this.test(
      (val) => val <= max,
      error ||
        ((val: number): RangeError =>
          new RangeError(
            `Expect value to be lower or equal than ${max} (actual: ${val})`,
          )),
    );
  }

  public gte = this.min;
  public lte = this.max;

  public gt(
    boundary: number,
    error?: ErrorLike<[number]>,
  ): ValidatorProxy<this> {
    if (!Number.isFinite(boundary)) {
      throw new Error(`Expect value to be a float "gt(${boundary})"`);
    }
    return this.test(
      (val) => val > boundary,
      error ||
        ((val: number): RangeError =>
          new RangeError(
            `Expect value to be greater than ${boundary} (actual: ${val})`,
          )),
    );
  }

  public lt(
    boundary: number,
    error?: ErrorLike<[number]>,
  ): ValidatorProxy<this> {
    if (!Number.isFinite(boundary)) {
      throw new Error(`Expect value to be a float "lt(${boundary})"`);
    }
    return this.test(
      (val) => val < boundary,
      error ||
        ((val: number): RangeError =>
          new RangeError(
            `Expect value to be lower than ${boundary} (actual: ${val})`,
          )),
    );
  }

  public between(
    min: number,
    max: number,
    error?: ErrorLike<[number]>,
  ): ValidatorProxy<this> {
    if (!Number.isFinite(min) || !Number.isFinite(max)) {
      throw new Error(`Expect value to be a float "between(${min},${max})"`);
    }
    return this.test(
      (val) => val >= min && val <= max,
      error ||
        ((val: number): RangeError =>
          new RangeError(
            `Expect value to be between ${min} and ${max} (actual: ${val})`,
          )),
    );
  }
}

const float = new FloatValidator(type('float')).proxy();

export default float;
