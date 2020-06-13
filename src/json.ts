import Validator from './Validator';
import FunctionType, { FunctionParameters } from './schema/FunctionType';
import { type } from './schema/validations';

export class JsonValidator<
  // eslint-disable-next-line @typescript-eslint/ban-types
  P extends FunctionParameters = [object]
  // eslint-disable-next-line @typescript-eslint/ban-types
> extends Validator<FunctionType<object, P>> {}

const json = new JsonValidator(type('json')).proxy();

export default json;
