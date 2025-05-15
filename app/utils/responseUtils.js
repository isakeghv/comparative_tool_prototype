// import { responses } from '~/public/script/reactive';

// get the count of how many answered x option for `Radio` and `Checkbox` type questions
export const countAnswers = (answersArr, optionsArr) => {
    const result = {};

    // initializing a key for each answer option, and give all a starting value of 0
    optionsArr.forEach((option) => {
        const id = option?.id ?? option;
        result[id] = 0;
    });

    // loop over the answers, check if the answer is a valid property within `result` object, then increment
    // check for answer.id (for study questions) if it exists as a property first, else the general 'answer' (for demographics)
    answersArr.forEach((answer) => {
        const value = answer?.id ?? answer;
        if (result[value] !== undefined) {
            result[value]++;
        }
    });

    return result;
}

export const formatResponses = (study, studyResponses) => {
    //return if not displaying responses
    if (!studyResponses || studyResponses.length === 0) return;

    const allResponses = studyResponses;

    //iterating over each response
    allResponses.forEach((r, index) => {
        const allDemoQuestions = r.demographic;
        const allQuestions = r.questions;
        // add participant numbering for each one
        r.participant = `${index + 1}`;

        // iterating over each demographic quest to add title
        allDemoQuestions.forEach(q => {
            const text = study.demographic.find(sq => sq.id == q.id)?.question;
            q.question = text;
        })
        
        //iterating over each question
        allQuestions.forEach(q =>{
            //getting the question-text for each question and inserting
            const text = study.questions.find(sq => sq.id == q.id)?.question;
            q.question = text;
        })
    })

    //inserting response into global accessible response.
    return JSON.parse(JSON.stringify(allResponses));
}

// function to download responses as JSON bloblob
export const downloadJson = (study, responses) => {
    if (!responses) return console.error('No data to download');

    const filename = `${study.title} - responses.json`;

    const blob = new Blob([JSON.stringify(responses, null, 2)], { type: 'application/json' })
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${filename}`;
    anchor.click();
}

// flatten the structure of object
const flattenResponse = (response) => {
    const flat = {
        status: response.status,
        startTime: response.startTime
    };

    // create columns for each demographic quesion with id of question, title of question, and answer of participants
    response.demographic?.forEach((q, qIndex) => {
        flat[`demographic/${qIndex}/id`] = q.id;
        flat[`demographic/${qIndex}/question`] = q.question;
        flat[`demographic/${qIndex}/answer/id`] = q.answer;
    });

    // create a column for each artifact and a question title column
    response.questions?.forEach((q, qIndex) => {
        flat[`questions/${qIndex}/id`] = q.id;
        flat[`questions/${qIndex}/question`] = q.question;

        q.answer?.forEach((a, aIndex) => {
            flat[`questions/${qIndex}/answer/${aIndex}/id`] = a.id;

            if (a.label) {
                flat[`questions/${qIndex}/answer/${aIndex}/label`] = a.label;
            }

            if (a.value) {
                flat[`questions/${qIndex}/answer/${aIndex}/value`] = a.value;
            }
        });
    });

    flat.timeTaken = response.timeTaken;
    flat.participant = response.participant;

    return flat;
}

const convertToCsv = (items) => {
    const flattenedItems = items.map(flattenResponse);

    // gather all unique keys (column headers)
    const allKeys = new Set();

    flattenedItems.forEach(item => {
        Object.keys(item).forEach(key => allKeys.add(key));
    });

    const header = Array.from(allKeys);

    // handle nulls -> if no answer for a specifc column, add ''
    const replacer = (_k, v) => v ?? '';

    // then join with comma
    const rows = flattenedItems.map(row =>
        header.map(field => JSON.stringify(row[field], replacer)).join(',')
    );

    return [header.join(','), ...rows].join('\r\n');
};

export const downloadCsv = (study, responses) => {
    if (!responses) return console.error('No data to download');

    const csv = convertToCsv(responses);
    const filename = `${study.title} - responses.csv`;

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
};