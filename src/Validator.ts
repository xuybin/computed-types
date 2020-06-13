import FunctionType, { FunctionParameters } from './schema/FunctionType';
import { ErrorLike } from './schema/errors';
import { destruct, equals, error, test } from './schema/validations';
import { isPromiseLike, MaybeAsync, ResolvedValue } from './schema/utils';
import { optional as optionalSchema } from './schema/logic';
import { MergeSchemaParameters } from './schema/io';

export type ValidatorProxy<
  V extends { validator: FunctionType },
  F extends FunctionType = V['validator']
> = Omit<V, 'validator' | 'proxy'> & { validator: F } & F;

export interface ValidatorConstructor<
  V extends Validator<F>,
  F extends FunctionType = V['validator']
> {
  new (validator: F): V;
}

export default class Validator<F extends FunctionType> {
  public readonly validator: F;

  public constructor(validator: F) {
    this.validator = validator;
  }

  public proxy(): ValidatorProxy<this> {
    return new Proxy(this.validator, {
      get: (
        target: unknown,
        propertyKey: string,
      ): this[keyof this] | F[keyof F] =>
        propertyKey in this
          ? this[propertyKey as keyof this]
          : this.validator[propertyKey as keyof F],
    }) as ValidatorProxy<this>;
  }

  public equals<T extends ResolvedValue<ReturnType<F>>>(
    value: T,
    error?: ErrorLike<[ResolvedValue<ReturnType<F>>]>,
  ): ValidatorProxy<this, FunctionType<T, Parameters<F>>> {
    return this.transform(equals(value, error));
  }

  public test(
    tester: FunctionType<unknown, [ResolvedValue<ReturnType<F>>]>,
    error?: ErrorLike<[ResolvedValue<ReturnType<F>>]>,
  ): ValidatorProxy<this> {
    return this.transform(test(tester, error));
  }

  public transform<
    T,
    V extends Validator<
      FunctionType<MaybeAsync<ReturnType<F>, T>, Parameters<F>>
    >
  >(
    fn: FunctionType<T, [ResolvedValue<ReturnType<F>>]>,
    constructor: ValidatorConstructor<V> = this
      .constructor as ValidatorConstructor<V>,
  ): ValidatorProxy<V> {
    const { validator } = this;

    return new constructor(((...args): T | PromiseLike<T> => {
      const res = validator(...args);

      if (!isPromiseLike(res)) {
        return fn(res);
      }

      return res.then((ret) =>
        fn(ret as ResolvedValue<ReturnType<F>>),
      ) as PromiseLike<T>;
    }) as FunctionType<MaybeAsync<ReturnType<F>, T>, Parameters<F>>).proxy();
  }

  public construct<P0 extends FunctionParameters>(
    fn: FunctionType<Parameters<F>, P0>,
  ): ValidatorProxy<this, FunctionType<ReturnType<F>, P0>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = (this as any).constructor;
    const { validator } = this;

    return new Class(
      (...args: P0): ReturnType<F> => validator(...fn(...args)),
    ).proxy();
  }

  public optional<
    R extends ResolvedValue<ReturnType<F>> | undefined = undefined
  >(
    defaultValue?: R,
  ): ValidatorProxy<
    this,
    FunctionType<
      ReturnType<F> | R,
      MergeSchemaParameters<Parameters<F> | [(undefined | null)?]>
    >
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = (this as any).constructor;
    const { validator } = this;

    return new Class(optionalSchema<F, R>(validator, defaultValue)).proxy();
  }

  public destruct(
    error?: ErrorLike<Parameters<F>>,
  ): ValidatorProxy<
    this,
    FunctionType<
      MaybeAsync<ReturnType<F>, [Error | null, ResolvedValue<ReturnType<F>>?]>,
      Parameters<F>
    >
  > {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = (this as any).constructor;
    const { validator } = this;

    return new Class(destruct(validator, error)).proxy();
  }

  public error(err: ErrorLike<Parameters<F>>): ValidatorProxy<this> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Class = (this as any).constructor;
    const { validator } = this;

    return new Class(error(validator, err)).proxy();
  }

  public prisma: Set<string> = new Set();

  public null(): this {
    this.prisma.add('?');
    return this;
  }

  public id(num?: number): this {
    this.prisma.add(`@id${num ? num : ''}`);
    return this;
  }

  public unique(num?: number): this {
    this.prisma.add(`@unique${num ? num : ''}`);
    return this;
  }

  public index(num?: number): this {
    this.prisma.add(`@index${num ? num : ''}`);
    return this;
  }

  public default(
    expression: string | number | boolean | 'now()' | 'cuid()' | 'uuid()',
  ): this {
    this.prisma.add(`@default(${expression})`);
    return this;
  }

  public relation(references: string[], name?: string): this {
    //if (typeof this == 'object') {
    this.prisma.add(
      `@relation(references: [${references.join(', ')}]${
        name ? ', name: ' + name : ''
      })`,
    );
    return this;
    // } else {
    //   throw new Error(`relation`);
    // }
  }
}
