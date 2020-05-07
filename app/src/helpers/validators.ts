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
    // no spaces in start/end of string
    // return value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i) !== null;
};

export const lengthValidator = (minLength: number, value: string): boolean => {
    return value.replace(/ /g, '').length >= minLength;
};

export const onlyNumbersValidator: Validator = (value: string): boolean => value.match(/^\d+$/) !== null;

// accepts string composed only with nums and with length === 10 or length === 12
export const phoneValidator: Validator = (value: string): boolean => value.match(/^(\d{10}|\d{12})$/) !== null;
