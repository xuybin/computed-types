import Validator, { ValidatorProxy } from './Validator';
import { StringValidator } from './string';
import { ErrorLike } from './schema/errors';
import FunctionType, { FunctionParameters } from './schema/FunctionType';
import { type } from './schema/validations';

export const INT_MIN_VALUE = -2147483648;
export const INT_MAX_VALUE = 2147483647;

export class IntValidator<
  P extends FunctionParameters = [number]
> extends Validator<FunctionType<number, P>> {
  public toLocaleString(
    ...args: Parameters<number['toLocaleString']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform(
      (val) => val.toLocaleString(...args),
      StringValidator,
    );
  }

  public toString(
    ...args: Parameters<number['toString']>
  ): ValidatorProxy<StringValidator<P>> {
    return this.transform((val) => val.toString(...args), StringValidator);
  }

  public min(min: number, error?: ErrorLike<[number]>): ValidatorProxy<this> {
    if (!Number.isInteger(min)) {
      throw new Error(`Expect value to be a int "min(${min})"`);
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
    if (!Number.isInteger(max)) {
      throw new Error(`Expect value to be a int "max(${max})"`);
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
    if (!Number.isInteger(boundary)) {
      throw new Error(`Expect value to be a int "gt(${boundary})"`);
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
    if (!Number.isInteger(boundary)) {
      throw new Error(`Expect value to be a int "lt(${boundary})"`);
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
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error(`Expect value to be a int "between(${min},${max})"`);
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

const int = new IntValidator(type('int')).proxy();

export default int;
