import { errorMsgs } from '~/public/script/reactive';

export const setMessage = (condition, msg) => {
    if (condition) {    
        if (!errorMsgs.list.includes(msg)) {
            errorMsgs.list.push(msg);
        }
    } else {
        const index = errorMsgs.list.indexOf(msg);
    
        if (index !== -1) {
            errorMsgs.list.splice(index, 1);
        }
    }
}

export const setMessageByType = (currentResponseType, responseType, condition, msg) => {
    // return if user have changed response type on question
    if (currentResponseType !== responseType) {
        const index = errorMsgs.list.indexOf(msg);
        if (index !== -1) {
            errorMsgs.list.splice(index, 1);
        }
        return;
    }

    setMessage(condition, msg);
}