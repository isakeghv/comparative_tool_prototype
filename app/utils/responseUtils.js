
// get the count of how many answered x option for `Radio` and `Checkbox` type questions
export const countAnswers = (answersArr, optionsArr) => {
    const result = {};

    // initializing a key for each answer option, and give all a starting value of 0
    optionsArr.forEach((option) => {
        const id = option?.id ?? option;
        result[id] = 0;
    });

    // loop over the answers, check if the answer is a valid property within `result` object, then increment
    // check for answer.id (for study questions) if it exists as a property first, else the general 'answer' (for demographics)
    answersArr.forEach((answer) => {
        const value = answer?.id ?? answer;
        if (result[value] !== undefined) {
            result[value]++;
        }
    });

    return result;
}


