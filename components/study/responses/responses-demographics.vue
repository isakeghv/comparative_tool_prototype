<template>
    <div class="demo__cont">
        <div v-if="!demographicReq">
            This study did not request any demographic information.
        </div>

        <div v-else-if="respondents === 0">
            No participant records available at the moment.
        </div>

        <div v-for="(question, qIdx) in showFormattedDemoData" :key="qIdx">
            <h3 class="demo__headline font-large font-medium">{{ question.title }}  {{ question.required ? '*' : '' }}</h3>
            <div v-if="!question.answer" class="greyed-out">
                No answer
            </div>
            <div v-else>
                <div v-if="question.responseType === 'radio'" v-for="(option, i) in question.radioOptions" class="demo__option" :key="i">
                    <label :for="`demo_radio-${qIdx}_option-${i}`" :class="{ 'greyed-out': option !== question.answer }">
                    <input :id="`demo_radio-${qIdx}_option-${i}`" type="radio" :checked="option === question.answer" tabindex="-1">
                        {{ option }}
                    </label>
                </div>
                <label v-if="question.responseType === 'text'" :for="`demo_text-${qIdx}`">
                    <textarea type="text" class="demo__textarea" :value="question.answer" :id="`demo_text-${qIdx}`" disabled></textarea>
                </label>
                <label v-if="question.responseType === 'number'" :for="`demo_number-${qIdx}`">
                    <input type="number" class="demo__number" :value="question.answer" :id="`demo_number-${qIdx}`" disabled>
                </label>
                <label v-if="question.responseType === 'date'" :for="`demo_date-${qIdx}`">
                    <input type="date" class="demo__date" :value="question.answer" :id="`demo_date-${qIdx}`" disabled>
                </label>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    respondents: Number,
    demographicReq: Boolean,
    demographic: Array,
    demographicData: Object
});

// combine the `demographicData` object with `study.demographic` to show the participant response
const showFormattedDemoData = computed(() => {
    if (!props.demographic || !props.demographicData) return [];

    // map each answer of x participant to the relevan question of the study
    return props.demographic.map((q) => {
        const response = props.demographicData[q.id];
            return {
                title: q.question,
                required: q.required,
                responseType: q.responseType,
                answer: response,
                radioOptions: q.radio.options 
            }
    });
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-demographics.scss');
</style>