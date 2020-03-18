export type Validator = (value: string) => boolean;

export const stringValidator: Validator = (value: string): boolean => {
    return !!value.length;
};

export const numberValidator: Validator = (value: string): boolean => {
    return !Number.isNaN(+value);
};

export const moneyValidator: Validator = (value: string): boolean => {
    const mantissa = value.match(/\.([^.]*)$/);

    return mantissa === null
    ? numberValidator(value)
    : numberValidator(value) && mantissa[0].length <= 3;
};

export const emailValidator: Validator = (value: string): boolean => {
    return value.match(/^.+@[^\.].*\.[a-z]{2,}$/) !== null;
};

export const lengthValidator = (minLength: number, value: string): boolean => {
    return value.length >= minLength;
};
