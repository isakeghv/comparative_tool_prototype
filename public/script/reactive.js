
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