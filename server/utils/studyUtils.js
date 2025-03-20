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

// load both `study` and `initialStudy` with the relevant study data to load correct data + reset save state
export const setStudyData = (study, initialStudy, studyData) => {
    study.id = studyData.id;
    study.title = studyData.title;
    study.description = studyData.description;
    study.demographicReq = studyData.demographicReq;
    study.demographic = studyData.demographic;
    study.customTerms = studyData.customTerms;
    study.questions = studyData.questions;
    study.desiredResponses = studyData.desiredResponses;
    study.closingMethod = studyData.closingMethod;
    study.closingLimit = studyData.closingLimit;

    initialStudy.title = studyData.title;
    initialStudy.description = studyData.description;
    initialStudy.demographicReq = studyData.demographicReq;
    initialStudy.demographic = studyData.demographic;
    initialStudy.customTerms = studyData.customTerms;
    initialStudy.questions = studyData.questions;
    initialStudy.desiredResponses = studyData.desiredResponses;
    initialStudy.closingMethod = studyData.closingMethod;
    initialStudy.closingLimit = studyData.closingLimit;
}