
//reactive variable to handle which form (register/login) is displayed
export const form = reactive({
    type: null,
})

// show responses version of question/demographics section 
export const showResponses = ref(false);

export const errorMsgs = reactive([]);
export const errorQuestions = reactive({});

//to store information to display in ui. "info" for user-info: name etc, 
// "studies" for the studies that is saved to user-id
export const user = reactive({
    info: null,
    studies: null,
})

export const showPreview = ref(false);

//reactive variable to hold the selected study-id and questions
export const study = reactive({
    id: null,
    title: null,
    description: null,
    closingMethod: [],
    closingLimit: {
        date: '',
        duration: '',
        responses: ''
    },
    desiredResponses: '',
    demographicReq: true,
    demographic: [],
    customTerms: {
        request: false,
        terms: ''
    },
    questions: [],
    createdAt: null,
    publishedAt: null,
    lastEdited: null
})

//for keeping track of the configs for undo/redo functionality
export const configs = ref([])
export const currentConfigIndex = ref(0);

//used for tracking all artifacts that have been uploaded;
export const allUploadedArtifacts = ref([]);

// to hold the initial configuration. used to compare if user is trying to return and changes have been made.
//     to make sure user cannot return and lose changes
export const initialStudy = reactive({
    title: null,
    description: null,
    closingMethod: [],
    closingLimit: {
        date: '',
        duration: '',
        responses: ''
    },
    desiredResponses: '',
    demographicReq: true,
    demographic: [],
    customTerms: {
        request: false,
        terms: ''
    },
    questions: [],
    createdAt: null,
    publishedAt: null,
    lastEdited: null
})

export const responses = ref(null);

// export const initialStudy = reactive({ ...study });

//used to handle which component should be displayed when creating a study (description, demographic etc).
//if "component" is a question, the ".question" should hold which question should be displayed
export const display = ({
    component: null,
    question: null,

    //demographicId will hold the id of the relevant demographic-question to modify, e.g: to show and update in demographic aside
    demographicId: null,
})

