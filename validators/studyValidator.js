import { errorQuestions } from '~/public/script/reactive';

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

        // Check for artifacts errors
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
    return hasErrors ? { error: 'validationFailed' } : { error: null };
};

export const validateDemographics = (study) => {
    let hasErrors = false;

    for (let field of study.demographic) {
        if (field.requested === true) {
            if (field.responseType === 'radio') {
                if (!q.radio.options.some(item => item.trim() !== '')) {
                    return errorQuestions['demographics'] = 'demographics';
                }
            }

            if (field.responseType === 'number') {
                const min = parseInt(field.range?.min);
                const max = parseInt(field.range?.max);
                if (min <= max) {
                    return errorQuestions['demographics'] = 'demographics';
                }
            }
        }
    }
};
