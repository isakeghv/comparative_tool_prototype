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
            <table class="table__cont table__cont--matrix">
                <thead class="table__thead table__thead--matrix">
                    <tr class="table__row table__row--head">
                        <th class="table__cell table__cell--head table__cell--artifact">Artifact</th>
                        <th v-for="(dropBox, idx) in question.drop.dropBox.filter(box => box !== '')"
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
                        <td v-for="(val, label) in artifact" :key="label" class="table__cell table__cell--matrix">
                            {{  artifact[label] }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="question.responseType === 'linear'">
            <table class="table__cont table__cont--matrix">
                <thead class="table__thead table__thead--matrix">
                    <tr class="table__row table__row--head">
                        <th class="table__cell table__cell--head table__cell--artifact">Artifact</th>
                        <th class="table__cell table__cell--head table__cell--matrix">Avg. Rank</th>
                        <th v-for="(idx) in question.artifacts.length"
                            :key="idx" class="table__cell table__cell--head table__cell--matrix">
                            {{ idx }}
                        </th>
                    </tr>
                </thead>
                <tbody>
                        <tr v-for="(artifact, artifactId) in linearAnswers" :key="artifactId">
                        <td class="table__cell table__cell--matrix">
                            <div class="artifact__container artifact__small">
                                <StudyArtifact
                                    :source="question.artifacts.find(a => a.id === artifactId).source"
                                    :alt="artifactId"
                                    :isRounded="true"
                                />
                            </div>
                        </td>
                        <td class="table__cell table__cell--matrix">
                            {{ calcPos[artifactId] || 0 }}
                        </td>
                        <td v-for="(val, idx) in artifact" :key="idx" class="table__cell table__cell--matrix">
                            {{  artifact[idx] }}
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

        <div v-if="['radio', 'checkbox'].includes(question.responseType)" class="charts__cont">
            <ChartsPie :dataObj="counts" />
        </div>

        <div v-if="question.responseType === 'drop'" class="charts__cont">
            <ChartsBarDrop :dataObj="dropAnswers" />
        </div>

        <div v-if="question.responseType === 'linear'" class="charts__cont">
            <ChartsBarLinear
                :dataObj="calcPos"
                :startLabel="question.linear.startLabel"
                :endLabel="question.linear.endLabel"
                :max="question.artifacts.length"
            />
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

console.log('for linear', props.studyResponses);

const formattedStudyQuestionData = computed(() => {
    const answers = [];
    let questionCounts = 0;

    props.studyResponses.forEach(({ questions }) => {
        // find the matching question
        const matchingQuestion = questions.find(q => q.id === props.question.id);

        // then get each answer, and push it to the 'answers' array
        if (matchingQuestion && matchingQuestion.answer && matchingQuestion.answer.length > 0) {
            if (props.question.responseType !== 'linear') {
                matchingQuestion.answer.forEach(item => {
                    answers.push(item);
                });
            } else {
                // push the array that includes the order of how the participant sorted the artifacts from left to right
                answers.push(matchingQuestion.answer);
            }

            // count how many responded to the question
            questionCounts += 1;
        }
    });

    return { answers, questionCounts };
});

const createMatrix = computed(() => {
    const q = props.question;
    const obj = {};    

    // loop through artifacts connected to the question, then each label to create a two-dimensional object
    q.artifacts.forEach(({ id }) => {
        if (!obj[id]) obj[id] = {};
    
        if (q.responseType === 'drop') {
            q.drop.dropBox
                .filter(label => label !== '')
                .forEach((label) => {
                    if (!obj[id][label]) {
                        obj[id][label] = 0;
                    }
                });
        }

        // if linear sort, create a label for each numeric position possible instead
        if (q.responseType === 'linear') {
            for (let i = 0; i < q.artifacts.length; i++) {
                if (!obj[id][i + 1]) {
                    obj[id][i + 1] = 0;
                }
            }
        }
    })

    return obj;
});

const answers = computed(() => formattedStudyQuestionData.value.answers);
const questionCounts = computed(() => formattedStudyQuestionData.value.questionCounts);

// compute number of times an answers has been picked
const counts = computed(() => countAnswers(answers.value, props.question.artifacts));

const dropAnswers = computed(() =>  {
    // get the empty matrix from the computed property that maps all possible answers out
    const matrix = createMatrix.value;

    // deconstruct id and label from each object (representing a participant answer), then increment the correct placement in the matrix
    answers.value.forEach(({ id, label }) => {
        // don't include empty boxes
        if (label !== '') {
            matrix[id][label]++;
        }
    })

    return matrix;
})

const linearAnswers = computed(() => {
    const matrix = createMatrix.value;

    // loop through the answers in the array, where the answers are arrays as well
    answers.value.forEach((participantAnswer) => {
        participantAnswer.forEach(({ id }, idx) => {
            // +1 due to the index starting at 1
            if (matrix[id] && matrix[id][idx + 1] !== undefined) {
                matrix[id][idx + 1]++;
            }
        });
    });


    return matrix;
})

// get average of position each artifact is placed in linear sorting
const calcPos = computed(() => {
    const result = {};

    Object.entries(linearAnswers.value).forEach(([artifactId, positionCounts]) => {
        let total = 0;
        let count = 0;

        Object.entries(positionCounts).forEach(([pos, val]) => {
            total += parseInt(pos) * val;
            count += val;
        });

        result[artifactId] = count === 0 ? 0 : (total / count).toFixed(2);
    });

    return result;
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
    @import url('public/style/components/responses/responses-demographics.scss');
</style>
    