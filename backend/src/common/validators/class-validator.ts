import {
  ArgumentMetadata,
  Injectable,
  Logger,
  PipeTransform,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ClassValidatorPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToInstance(metatype, value);

    if (!object) {
      Logger.error('Validation failed: object is null or undefined');
      throw new UnprocessableEntityException('Validation failed');
    }

    const errors = await validate(object, {
      whitelist: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      const formattedErrors = this.formatErrors(errors);
      console.log(object);
      Logger.error(`Validation failed: ${JSON.stringify(formattedErrors)}`);

      throw new UnprocessableEntityException({
        message: 'Validation failed',
        errors: formattedErrors,
      });
    }

    return value;
  }

  private formatErrors(errors: any[]) {
    return errors.map((err) => ({
      property: err.property,
      errors: Object.values(err.constraints || {}),
      children:
        err.children && err.children.length > 0
          ? this.formatErrors(err.children)
          : undefined,
    }));
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return metatype && !types.includes(metatype);
  }
}
