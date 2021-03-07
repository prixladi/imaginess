import joi from 'joi';

type Errors = Record<string, string[]>;

const validate = <T extends unknown>(schema: joi.AnySchema, object: T, extendErrors?: Errors | null): Errors | null => {
  const result = schema.validate(object, { abortEarly: false });
  if (result.error) {
    return result.error.details
      .map((item) => ({ message: item.message, path: item.path.join('.') }))
      .reduce((prev, dto) => {
        if (!prev[dto.path]) {
          prev[dto.path] = [dto.message];
        } else {
          prev[dto.path].push(dto.message);
        }

        return prev;
      }, extendErrors ?? ({} as Errors));
  }

  return null;
};

export { validate };
