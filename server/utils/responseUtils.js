// utility functions for 
export const addNewOption = (existingOptions, optionModel) =>{
    //add "options" if issue not already existing: question does not have options
    if (!existingOptions) existingOptions = [];

    //pushing new option to multiple choice; add them to the correct model to display to UI 
    existingOptions.push('');
    optionModel = [...existingOptions];
}

// delete a specific option for `Radio` at its index using splice
export const removeOptionAtIndex = (existingOptions, optionModel, index) =>{
    optionModel.splice(index, 1);
    existingOptions = optionModel;
}
