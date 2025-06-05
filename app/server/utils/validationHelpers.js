const checkType = (input, acceptedType) => {
    if (input === null || input === undefined) return false
    if (acceptedType === 'array') return Array.isArray(input);
    return typeof input === acceptedType;
}

const checkLength = (input, min, max) => {
    return input.length >= min && input.length <= max;
}

const helper = { checkType, checkLength }

export default helper