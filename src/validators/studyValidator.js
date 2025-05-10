import { errorMsgs, errorQuestions } from '~/public/script/reactive';

const validateCheckbox = (q) => {
    const min = parseInt(q.checkbox.selectionMin);
    const max = parseInt(q.checkbox.selectionMax);
    const artifactsLength = q.artifacts?.length || 0;

    if (!(min >= 1 && max > 1 && min <= max && max <= artifactsLength)) {
        return 'checkbox';
    }

    return null;
};

const validateRange = (q) => {
    const min = parseInt(q.range.min);
    const max = parseInt(q.range.max);

    if (!(min >= 1 && max <= 100 && min <= max)) {
        return 'range';
    }

    return null;
};

const validateDrop = (q) => {
    if (!q.drop.dropBox.some(item => item.trim() !== '')) {
        return 'drop';
    }

    return null;
};

const validators = {
    checkbox: validateCheckbox,
    range: validateRange,
    drop: validateDrop,
};

export const validateStudy = (study) => {
    let hasErrors = false;

    study.questions.forEach((q) => {
        const qErrors = [];

        // check for artifacts errors
        if (!Array.isArray(q.artifacts) || q.artifacts.length === 0) {
            qErrors.push('artifacts');
        }

        const validator = validators[q.responseType];
        const typeError = validator ? validator(q) : null;
        
        if (typeError) {
            qErrors.push(typeError);
        }

        // if errors are found, store them in the errorQuestions object
        if (qErrors.length > 0) {
            errorQuestions[q.id] = qErrors;
            hasErrors = true;
        } else {
            // remove from errorQuestions
            delete errorQuestions[q.id];
        }
    });

    // return the error state and the errorQuestions object
    return hasErrors;
};

// return on first found error if invalid data within requested questions
export const validateDemographics = (study) => {
    // filter out non-requested questions to validate
    const requestedQ = study.demographic.filter(field => field.request === true);

    // loop through each question
    for (let field of requestedQ) {
        // checks if each demographic question has a title
        if (!field.question || field.question.trim() === '') {
            return true;
        }

        if (field.responseType === 'radio') {
            if (!field.radio.options.some(item => item.trim() !== '')) {
                return true;
            }
        }

        if (field.responseType === 'number') {
            const min = parseInt(field.number?.min);
            const max = parseInt(field.number?.max);

            if (!(min >= 1 && max <= 100 && min <= max)) {
                return true;
            }
        }
    }

    return false;
};

// remove error on condition
export const removeErr = (condition, word) => {
    if (condition) {
        const index = errorMsgs.indexOf(word);
        if (index !== -1) errorMsgs.splice(index, 1);
    }
}