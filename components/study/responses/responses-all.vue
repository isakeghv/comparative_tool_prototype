<template>
    <div v-if="respondents === 0 || answers.length === 0" class="responses__cont">
        No participant records available at the moment.
    </div>

    <div v-else-if="selectedView === 'all'" class="responses__cont demo__cont--compact">
        <div class="demo__header">
            <h3 class="responses__headline font-h5 font-medium">{{ question?.question }}</h3>
            <span class="demo__subheadline font-normal">{{ questionCounts || 0 }} responses</span>
        </div>

        <div v-if="['radio', 'checkbox'].includes(question.responseType)">
            <table class="table__cont">
                <thead class="table__thead">
                    <tr class="table__row table__row--head">
                        <th class="table__cell table__cell--head table__cell--artifact">Artifact</th>
                        <th class="table__cell table__cell--head">ID</th>
                        <th class="table__cell table__cell--head table__cell--total">Total</th>
                    </tr>
                </thead>
                <tbody class="table__tbody">
                    <tr v-for="(count, option) in counts" :key="option" class="table__row table">  
                        <td class="table__cell">
                            <div class="artifact__container artifact__small">
                                <StudyArtifact
                                    :source="question.artifacts.find(a => a.id === option).source"
                                    :alt="option"
                                    :isRounded="true"
                                />
                            </div>
                        </td>
                        <td class="table__cell">{{ option }}</td>
                        <td class="table__cell">{{ count }}</td>
                    </tr>    
                </tbody>
            </table>
        </div>

        <div v-if="question.responseType === 'drop'">
            <!-- {{  dropMatrix }} -->
            <table class="table__cont table__cont--matrix">
                <thead class="table__thead">
                    <tr class="table__row table__row--head">
                        <th class="table__cell table__cell--head table__cell--artifact">Artifact</th>
                        <th v-for="(dropBox, idx) in question.drop.dropBox"
                            :key="idx" class="table__cell table__cell--head table__cell--matrix">
                            {{ dropBox }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(artifact, artifactId) in dropAnswers" :key="artifactId">
                        <td class="table__cell table__cell--matrix">
                            <div class="artifact__container artifact__small">
                                <StudyArtifact
                                    :source="question.artifacts.find(a => a.id === artifactId).source"
                                    :alt="artifactId"
                                    :isRounded="true"
                                />
                            </div>
                        </td>
                        <td v-for="(value, label) in artifact" :key="label" class="table__cell table__cell--matrix">
                            {{  artifact[label] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-else-if="selectedView === 'graphs'" class="demo__cont demo__cont--compact">
        <div class="demo__header">
            <h3 class="responses__headline font-h5 font-medium">{{ question.question }}</h3>
            <span class="demo__subheadline font-normal">{{ questionCounts || 0 }} responses</span>
        </div>

        <div v-if="['radio', 'checkbox'].includes(question.responseType)">
            <div class="charts__cont">
                <ChartsPie :dataObj="counts" />
            </div>
        </div>

        <div v-if="question.responseType === 'drop'">
            <div class="charts__cont">
                <ChartsBarMatrix :dataObj="dropAnswers" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { countAnswers } from '~/utils/responseUtils.js';

const props = defineProps({
    question: Object,
    answers: Array,
    respondents: Number,
    selectedView: String,
    studyResponses: Array
});

const formattedStudyQuestionData = computed(() => {
    const answers = [];
    let questionCounts = 0;

    props.studyResponses.forEach(({ questions }) => {
        // find the matching question
        const matchingQuestion = questions.find(q => q.id === props.question.id);

        // then get each answer, and push it to the 'answers' array
        if (matchingQuestion && matchingQuestion.answer && matchingQuestion.answer.length > 0) {
            matchingQuestion.answer.forEach(item => {
                answers.push(item);
            });

            // count how many responded to the question
            questionCounts += 1;
        }
    });

    return { answers, questionCounts };
});

const dropMatrix = computed(() => {
    const q = props.question;
    const dropObj = {};

    if (q.responseType !== 'drop') return;
    

    // loop through artifacts connected to the question, then each label to create a two-dimensional arr
    q.artifacts.forEach(({ id }) => {
        if (!dropObj[id]) dropObj[id] = {};
    
        q.drop.dropBox.forEach((label) => {
            if (!dropObj[id][label]) {
                dropObj[id][label] = 0;
            }
        })
    })

    return dropObj;
})

const answers = computed(() => formattedStudyQuestionData.value.answers);
const questionCounts = computed(() => formattedStudyQuestionData.value.questionCounts);

// compute number of times an answers has been picked
const counts = computed(() => countAnswers(answers.value, props.question.artifacts));

console.log(props.question);
console.log(answers);

const dropAnswers = computed(() =>  {
    // get the empty matrix from the computed property that maps all possible answers out
    const matrix = dropMatrix.value;

    // deconstruct id and label from each object (representing a participant answer), then increment the correct placement in the matrix
    answers.value.forEach(({ id, label }) => {
        matrix[id][label]++;
    }) 

    return matrix;
})
</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
@import url('public/style/components/responses/responses-demographics.scss');
</style>
    