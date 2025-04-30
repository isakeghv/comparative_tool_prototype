<template>
    <div v-if="!demographicReq" class="demo__cont">
        This study did not request any demographic information.
     </div>

    <div v-else-if="respondents === 0 || formattedDemoData.length === 0" class="demo__cont">
        No participant records available at the moment.
    </div>

    <div v-else-if="selectedView === 'all'" class="font-small">
        <div v-for="(q, qIdx) in formattedDemoData" :key="qIdx" class="demo__cont demo__cont--compact">
            <div class="demo__header">
                <h3 class="font-large font-medium">{{ q.title }}</h3>
                <span class="demo__subheadline font-small">{{ questionCounts[q.id] || 0 }} responses</span>
            </div>
            <div v-if="q.responseType === 'text'" class="demo__list">
                <span v-for="(answer, i) in q.answers" :key="`demo_question-${qIdx}_answer-${i}`" class="demo__txt demo__item">
                    {{ answer }}
                </span>
            </div>

            <div v-if="q.responseType === 'radio'">
                <table class="table__cont">
                    <thead class="table__thead">
                        <tr class="table__row table__row--head">
                        <th class="table__cell table__cell--head">Option</th>
                        <th class="table__cell table__cell--head table__cell--total">Total</th>
                        </tr>
                    </thead>
                    <tbody class="table__tbody">
                        <tr v-for="(count, option) in demoAnswerCounts[q.id]" :key="option" class="table__row">
                        <td class="table__cell font-semi">{{ option }}</td>
                        <td class="table__cell">{{ count }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="q.responseType === 'number'">
                <span class="demo__txt font-small">Average: <span class="font-small font-semi">{{ calculateAverage(q.answers) }}</span></span>
                <span class="demo__txt font-small">Median: <span class="font-small font-semi">{{ calculateMedian(q.answers) }}</span></span>
            </div>

            <div v-if="q.responseType === 'date'">
                <div v-for="(months, year) in groupedDates(q.answers)" :key="year">
                    <details>
                        <summary class="date__summary">{{ year }}</summary>

                        <div v-for="(days, month) in months" :key="month" class="date__month">
                            <details>
                                <summary class="date__summary">{{ month }}</summary>

                                <ul class="date__list">
                                    <li v-for="(count, day) in days" :key="day" class="date__day">
                                        {{ day }} ({{ count }})
                                    </li>
                                </ul>
                            </details>
                        </div>
                    </details>
                </div>
            </div>
        </div>
    </div>

    <div v-else-if="selectedView === 'graphs'">
        <div v-for="(q, qIdx) in formattedDemoData" :key="qIdx">
            <!-- Only render if q is defined and responseType is 'radio' -->
            <div v-if="q && q.responseType === 'radio'" class="demo__cont demo__cont--compact">
                <div class="demo__header">
                    <h3 class="font-large font-medium">{{ q.title }}</h3>
                    <span class="demo__subheadline font-small">{{ questionCounts[q.id] || 0 }} responses</span>
                </div>
                <div class="charts__cont">
                    <ChartsPie :dataObj="countAnswers(q.answers, q.responseFormat.options)" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { countAnswers } from '~/utils/responseUtils.js';

const props = defineProps({
    respondents: Number,
    demographicReq: Boolean,
    demographic: Array,
    selectedView: String,
    studyResponses: Array
});

// compute number of times an answers has been picked
const counts = computed(() => countAnswers(answers, props.question.artifacts))

// object to store how many respondents have answered each question
const questionCounts = {};

const formattedDemoData = computed(() => {
    const result = {};

    // collect answers grouped by question id
    props.studyResponses.forEach(({ demographic }) => {
        demographic.forEach(({ id, answer }) => {

            // if the id isn't in the object, create an empty array
            if (!result[id]) result[id] = [];

            // update the count of `questionCounts` if the question has been answered by the participant
            if (answer && answer.length > 0) {
                if (!questionCounts[id]) questionCounts[id] = 0;
                questionCounts[id] += 1;
            }

            // push in the answer for that question
            result[id].push(answer);
        });
    });

    // merge relevant parts of questions' meta-data with collected answers (only questions that have been requested)
    return props.demographic.filter(q => q.request).map((q) => {
        return {
            id: q.id,
            title: q.question,
            required: q.required,
            responseType: q.responseType,
            responseFormat: q[q.responseType],
            answers: result[q.id] || []
        };
    });
});


// compute the count of how many time a question has been answered for each `radio` question
console.log(formattedDemoData.value);

const demoAnswerCounts = computed(() => {
    const counts = {};
    formattedDemoData.value.forEach((q) => {
        if (q.responseType === 'radio') {
            counts[q.id] = countAnswers(q.answers, q.responseFormat.options);
        }
    });
    return counts;
});

// use built-in `reduce` to loop through and get the total, then get the average
const calculateAverage = (arr) => {
    const total = arr.reduce((acc, num) => acc + Number(num), 0);
    return (total / arr.length).toFixed(2);
}

// calculate median of `Number` type questions
const calculateMedian = (arr) => {
    // map the strings into floats, and sort the arr to ascending order
    const numericArr = arr.map(str => parseFloat(str));
    numericArr.sort((a, b) => a - b);
    const length = numericArr.length;

    // get the middle value by round down
    const mid = Math.floor(length / 2);

    // return the middle value if it's odd, or the average of the two elements in the middle if not
    if (length % 2 !== 0) return numericArr[mid];
    return (numericArr[mid - 1] + numericArr[mid]) / 2;
};

// loop through dates with the structure 'YYYY-MM-DD', set properties of years, months, and days, and count how many times each date appears
const groupedDates = (arr) => {
  const result = {};

    arr.forEach(dateStr => {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = date.toLocaleString('default', { month: 'long' });
        const day = date.getDate();

        if (!result[year]) {
            result[year] = {};
        }

        if (!result[year][month]) {
            result[year][month] = {};
        }

        if (!result[year][month][day]) {
            result[year][month][day] = 0;
        }

        result[year][month][day]++;
  });

  return result;
}
</script>

<style scoped>
@import url('public/style/components/responses/responses-demographics.scss');
</style>