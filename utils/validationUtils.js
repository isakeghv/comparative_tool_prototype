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