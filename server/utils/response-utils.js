// utility functions for 
export const addOption = (currentOptions, optionModel) =>{
    //add "options" if issue not already existing: question does not have options
    if (!currentOptions) currentOptions = [];

    //pushing new option to multiple choice; add them to the correct model to display to UI 
    currentOptions.push('');
    optionModel = currentOptions;
}

// const addOption = ()=>{
//     //add "options" if issue not already existing: question does not have options
//     if (!selectedQuestion.value.radio.options) selectedQuestion.value.radio.options = [];

//     //pushing new option to multiple-choise
//     selectedQuestion.value.radio.options.push('');
//     optionsModel.value = selectedQuestion.value.radio.options;
// }


// delete a specific option for `Radio` at its index using splice
export const deleteOption = (index) =>{
    optionsModel.value.splice(index, 1);
    selectedQuestion.value.options = optionsModel.value;
}
