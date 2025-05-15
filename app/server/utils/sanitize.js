
//sanitizing - For making sure injection cannot be made
export const sanitizer = (input) =>{

    //check if including arrays: errors if not due to different formats being sanitized
    if (Array.isArray(input)) return input.map(sanitizer);

    if (typeof input !== 'object' || input == null) return input;

    //for storing cleaned input
    const cleaned = {};

    //going over input and sanitizing it
    for (const key in input){
        if (key.includes('$') || key.includes('.')) continue;
        //recursive to go through everything
        cleaned[key] = sanitizer(input[key])
    }

    //return cleaned/sanitized
    return cleaned;
}