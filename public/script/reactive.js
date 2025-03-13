
//reactive variable to handle which form (register/login) is displayed
export const form = reactive({
    type: null,
})

//to store information to display in ui. "info" for user-info: name etc, 
// "studies" for the studies that is saved to user-id
export const user = reactive({
    info: null,
    studies: null,
})

//reactive variable to hold the selected study-id and questions
export const study = reactive({
    id: null,
    title: null,
    description: null,
    questions: [],
    demographicReq: true,
    demographic: []
})

//to hold the initial configuration. used to compare if user is trying to return and changes have been made.
    //to make sure user cannot return and lose changes
export const initialStudy = reactive({
    title: null,
    description: null,
    questions: [],
    demographicReq: true,
    demographic: []
})

//used to handle which component should be displayed when creating a study (description, demographic etc).
//if "component" is a question, the ".question" should hold which question should be displayed
export const display = ({
    component: null,
    question: null,

    //demographicId will hold the id of the relevant demographic-question to modify, e.g: to show and update in demographic aside
    demographicId: null,
})