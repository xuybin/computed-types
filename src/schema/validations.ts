import { ErrorLike, toError } from './errors';
import FunctionType, { FunctionParameters } from './FunctionType';
import {
  Enum,
  isPromiseLike,
  MaybeAsync,
  ResolvedValue,
  Typeof,
} from './utils';

export const INT_MIN_VALUE = -2147483648;
export const INT_MAX_VALUE = 2147483647;

export const FLOAT_MIN_VALUE = new Number('-3.402823466E+38').valueOf();
export const FLOAT_MAX_VALUE = new Number('3.402823466E+38').valueOf();

export function type<
  T extends keyof Typeof,
  P extends FunctionParameters = [Typeof[T]]
>(type: T, error?: ErrorLike<P>): FunctionType<Typeof[T], P> {
  return (...args: P): Typeof[T] => {
    switch (type) {
      case 'int':
        if (
          typeof args[0] !== 'number' ||
          !Number.isInteger(args[0]) ||
          (args[0] as number) < INT_MIN_VALUE ||
          (args[0] as number) > INT_MAX_VALUE
        ) {
          throw toError(error || `Expect value to be "${type}"`, ...args);
        }
        break;
      case 'float':
        if (
          typeof args[0] !== 'number' ||
          !Number.isFinite(args[0]) ||
          (args[0] as number) < FLOAT_MIN_VALUE ||
          (args[0] as number) > FLOAT_MAX_VALUE
        ) {
          throw toError(error || `Expect value to be "${type}"`, ...args);
        }
        break;
      case 'json':
        if (typeof args[0] !== 'object' || args[0] === null) {
          throw toError(error || `Expect value to be "${type}"`, ...args);
        }
        break;
      case 'dateTime':
        if (
          typeof args[0] !== 'string' ||
          !/^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29) (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(
            args[0] as string,
          )
        ) {
          throw toError(error || `Expect value to be "${type}"`, ...args);
        }
        break;
      default:
        if (typeof args[0] !== type || args[0] === null) {
          throw toError(error || `Expect value to be "${type}"`, ...args);
        }
        break;
    }
    return args[0] as Typeof[T];
  };
}

export function equals<T, P extends FunctionParameters = [T]>(
  expected: T,
  error?: ErrorLike<P>,
): FunctionType<T, P> {
  return (...args: P): T => {
    if (args[0] !== expected) {
      throw toError(error || `Expect value to equal "${expected}"`, ...args);
    }

    return args[0] as T;
  };
}

export function test<P extends FunctionParameters>(
  tester: FunctionType<unknown, P>,
  error?: ErrorLike<P>,
): FunctionType<P[0], P> {
  return (...args: P): P[0] => {
    if (!tester(...args)) {
      throw toError(error || `Validation test failed`, ...args);
    }

    return args[0];
  };
}

export function destruct<F extends FunctionType>(
  validator: F,
  error?: ErrorLike<Parameters<F>>,
): FunctionType<
  MaybeAsync<ReturnType<F>, [Error | null, ResolvedValue<ReturnType<F>>?]>,
  Parameters<F>
> {
  return ((
    ...args: Parameters<F>
  ):
    | [Error | null, ResolvedValue<ReturnType<F>>?]
    | PromiseLike<[Error | null, ResolvedValue<ReturnType<F>>?]> => {
    try {
      const res = validator(...args);
      if (!isPromiseLike(res)) {
        return [null, res];
      }

      return res.then(
        (ret) => [null, ret],
        (err) => [error ? toError(error, ...args) : err],
      ) as PromiseLike<[Error | null, ResolvedValue<ReturnType<F>>?]>;
    } catch (err) {
      return [error ? toError(error, ...args) : err];
    }
  }) as FunctionType<
    MaybeAsync<ReturnType<F>, [Error | null, ResolvedValue<ReturnType<F>>?]>,
    Parameters<F>
  >;
}

export function error<R, P extends FunctionParameters>(
  validator: FunctionType<R, P>,
  err: ErrorLike<P>,
): FunctionType<R, P> {
  return (...args: P): R => {
    try {
      const res = validator(...args);
      if (!isPromiseLike(res)) {
        return res;
      }

      return (res.then(null, (): never => {
        throw toError(err, ...args);
      }) as unknown) as R;
    } catch (e) {
      throw toError(err, ...args);
    }
  };
}

export function regexp<P extends FunctionParameters = [string]>(
  exp: RegExp | string,
  error?: ErrorLike<P>,
): FunctionType<string, P> {
  if (!(exp instanceof RegExp)) {
    exp = new RegExp(exp);
  }

  return (...args: P): string => {
    if (!(exp as RegExp).test(args[0] as string)) {
      throw toError(
        error || `Invalid string format (expected: ${exp})`,
        ...args,
      );
    }

    return String(args[0]);
  };
}

export function array<
  R extends Array<unknown>,
  P extends FunctionParameters = [R]
>(length: number | null = null, error?: ErrorLike<P>): FunctionType<R, P> {
  const isArray = (...args: P): R => {
    if (!Array.isArray(args[0])) {
      throw toError(error || `Expecting value to be an array`, ...args);
    }

    return args[0] as R;
  };

  if (length === null) {
    return isArray;
  }

  return (...args: P): R => {
    const arr = isArray(...args);

    if (arr.length !== length) {
      throw toError(
        error || `Expected array length ${length} (given: ${arr.length})`,
        ...args,
      );
    }

    return arr;
  };
}

export function enumValue<
  E extends Enum<E>,
  P extends FunctionParameters = [E[keyof E]]
>(value: E, error?: ErrorLike<P>): FunctionType<E[keyof E], P> {
  const values = new Set<E[keyof E]>(
    Object.keys(value)
      .filter((key) => isNaN(Number(key)))
      .map((key) => value[key as keyof E]),
  );

  return (...args: P): E[keyof E] => {
    if (!values.has(args[0] as E[keyof E])) {
      throw toError(error || 'Unknown enum value', ...args);
    }

    return args[0] as E[keyof E];
  };
}
