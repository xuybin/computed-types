import unknown from './unknown';
import object from './object';
import array from './array';
import string from './string';
import float from './float';
import int from './int';
import boolean from './boolean';
import Schema from './Schema';
import {
  SchemaResolveType,
  SchemaParameters,
  MergeSchemaParameters,
  SchemaReturnType,
  SchemaValidatorFunction,
} from './schema/io';
import { ValidationError, PathError } from './schema/errors';
import { isPromiseLike, ResolvedValue } from './schema/utils';

// type generator
export type Type<S> = SchemaResolveType<S>;

// type helpers
export {
  ValidationError,
  PathError,
  SchemaParameters,
  MergeSchemaParameters,
  SchemaReturnType,
  SchemaValidatorFunction,
  ResolvedValue,
};

// runtime schema
export default Schema;

// runtime types
export { unknown, object, array, string, int, float, boolean };

// runtime helpers
export { isPromiseLike };
