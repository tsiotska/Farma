export type Validator = (value: string) => boolean;

export const stringValidator: Validator = (value: string): boolean => {
    return !!value.length;
};

export const numberValidator: Validator = (value: string): boolean => {
    return !Number.isNaN(+value);
};

export const moneyValidator: Validator = (value: string): boolean => {
    const q = value.match(/\.([^.]*)$/);

    return q === null
    ? numberValidator(value)
    : numberValidator(value) && q[0].length <= 3;
};

export const lengthValidator: Validator = (value: string): boolean => {
    return value.length >= 1;
};

export const composeValidators = (...validators: Validator[]) =>
    (value: string): boolean => {
        return validators.reduce(
            (result, validator) => result && validator(value),
            true
        );
    };
