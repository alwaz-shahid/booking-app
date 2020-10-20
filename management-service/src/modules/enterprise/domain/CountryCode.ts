import { ValueObject } from 'shared/domain';
import { Guard, Result } from 'shared/core';

import { countryCodes } from './countryCodes';

interface IProps {
  value: string;
}

console.log("test 1");

export class CountryCode extends ValueObject<IProps> {
  get value() {
    return this.props.value;
  }

  private constructor(props: IProps) {
    super(props);
  }

  public static create(props: IProps): Result<CountryCode> {
    const guardResult = Guard.isOneOf({
      value: props.value,
      argumentName: 'countryCode',
      validValues: countryCodes,
    });

    if (!guardResult.succeeded) {
      return Result.fail(guardResult);
    }

    return Result.ok(new CountryCode(props));
  }
}
