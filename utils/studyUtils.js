// utility functions for adding and removing option boxes for certain response types
export const addNewOption = (existingOptions, optionModel) => {
    //add "options" if issue not already existing: question does not have options
    if (!existingOptions) existingOptions = [];

    //pushing new option to multiple choice; add them to the correct model to display to UI 
    existingOptions.push('');
    optionModel = [...existingOptions];
}

// delete a specific option for `Radio` at its index using splice
export const removeOptionAtIndex = (existingOptions, optionModel, index) => {
    optionModel.splice(index, 1);
    existingOptions = optionModel;
}

// need to pass all the comparisons to pass it as true (probably should find a way to not repeat too much)
export const compareStudies = (study1, study2) => {
    // console.log(study1);
    // console.log(study2);
    return JSON.stringify(study1.questions) === JSON.stringify(study2.questions) &&
           JSON.stringify(study1.demographicReq) === JSON.stringify(study2.demographicReq) &&
           JSON.stringify(study1.demographic) === JSON.stringify(study2.demographic) &&
           JSON.stringify(study1.description) === JSON.stringify(study2.description) &&
           JSON.stringify(study1.title) === JSON.stringify(study2.title) &&
           JSON.stringify(study1.customTerms) === JSON.stringify(study2.customTerms) &&
           JSON.stringify(study1.desiredResponses) === JSON.stringify(study2.desiredResponses) &&
           JSON.stringify(study1.closingLimit) === JSON.stringify(study2.closingLimit) &&
           JSON.stringify(study1.closingMethod) === JSON.stringify(study2.closingMethod);
};
