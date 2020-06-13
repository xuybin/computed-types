import { ErrorLike } from './schema/errors';
import Validator, { ValidatorProxy } from './Validator';
import FunctionType, { FunctionParameters } from './schema/FunctionType';
import { type } from './schema/validations';

/**
 * 字符串转Date 日期时间,如:2020-01-01 00:00:01
 */
function stringToDate(timeStr: string): Date | undefined {
  if (timeStr.indexOf('-') != -1 && timeStr.split(' ').length == 2) {
    const nyrArr = timeStr.split(' ')[0].split('-');
    const sfmArr = timeStr.split(' ')[1].split(':');
    if (nyrArr.length == 3 && sfmArr.length == 3) {
      return new Date(
        parseInt(nyrArr[0]),
        parseInt(nyrArr[1]) - 1,
        parseInt(nyrArr[2]),
        parseInt(sfmArr[0]),
        parseInt(sfmArr[1]),
        parseInt(sfmArr[2]),
        0,
      );
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export class DateTimeValidator<
  P extends FunctionParameters = [string]
> extends Validator<FunctionType<string, P>> {
  public before(
    dateTime: string,
    error?: ErrorLike<[string]>,
  ): ValidatorProxy<this> {
    let beforeDate: Date;
    if (
      /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29) (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(
        dateTime,
      )
    ) {
      beforeDate = stringToDate(dateTime) as Date;
    } else {
      throw new Error(`Expect value to be a dateTime "before(${dateTime})"`);
    }
    return this.test(
      (str) => (stringToDate(str) as Date) < beforeDate,
      error ||
        ((str): RangeError =>
          new RangeError(
            `Expect value to be before ${dateTime} (actual: ${str})`,
          )),
    );
  }

  public after(
    dateTime: string,
    error?: ErrorLike<[string]>,
  ): ValidatorProxy<this> {
    let afterDate: Date;
    if (
      /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29) (20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/.test(
        dateTime,
      )
    ) {
      afterDate = stringToDate(dateTime) as Date;
    } else {
      throw new Error(`Expect value to be a dateTime "after(${dateTime})"`);
    }
    return this.test(
      (str) => (stringToDate(str) as Date) > afterDate,
      error ||
        ((str): RangeError =>
          new RangeError(
            `Expect value to be after ${dateTime} (actual: ${str})`,
          )),
    );
  }

  public beforeNow(
    offsetSeconds: number,
    error?: ErrorLike<[string]>,
  ): ValidatorProxy<this> {
    return this.test(
      (str) =>
        (stringToDate(str) as Date) <
        new Date(new Date().getTime() + 1000 * offsetSeconds),
      error ||
        ((str): RangeError =>
          new RangeError(
            `Expect value to be beforeNow ${offsetSeconds} number (actual: ${str})`,
          )),
    );
  }

  public afterNow(
    offsetSeconds: number,
    error?: ErrorLike<[string]>,
  ): ValidatorProxy<this> {
    return this.test(
      (str) =>
        (stringToDate(str) as Date) >
        new Date(new Date().getTime() + 1000 * offsetSeconds),
      error ||
        ((str): RangeError =>
          new RangeError(
            `Expect value to be afterNow ${dateTime} number (actual: ${str})`,
          )),
    );
  }
}

const dateTime = new DateTimeValidator(type('dateTime')).proxy();

export default dateTime;
