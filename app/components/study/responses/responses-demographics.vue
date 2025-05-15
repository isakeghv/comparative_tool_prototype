<template>
    <div v-if="!demographicReq" class="demo__cont">
        This study did not request any demographic information.
    </div>

    <div v-else-if="respondents === 0 || (Array.isArray(formattedDemoData) && formattedDemoData.length === 0)" class="demo__cont">
        No participant records available at the moment.
    </div>

    <div v-else class="demo__cont">
        <div v-for="(q, qIdx) in formattedDemoData" :key="qIdx">
            <h3 class="demo__headline font-large font-medium">{{ q.title }}</h3>

            <div v-if="!q.answer" class="font-small greyed-out">
                No answer
            </div>

            <div v-else>
                <div v-if="q.responseType === 'radio'" v-for="(option, i) in q.responseFormat.options.filter(option => option.trim() !== '')" class="demo__option" :key="i">
                    <label :for="`demo_radio-${qIdx}_option-${i}`" class="font-small" :class="{ 'greyed-out': option !== q.answer }">
                    <input :id="`demo_radio-${qIdx}_option-${i}`" class="demo__option--input" type="radio" :checked="option === q.answer" tabindex="-1">
                        {{ option }}
                    </label>
                </div>
                <label v-if="q.responseType === 'text'" :for="`demo_text-${qIdx}`">
                    <textarea type="text" class="demo__textarea font-small" :value="q.answer" :id="`demo_text-${qIdx}`" disabled></textarea>
                </label>
                <label v-if="q.responseType === 'number'" :for="`demo_number-${qIdx}`">
                    <input type="number" class="demo__number font-small" :value="q.answer" :id="`demo_number-${qIdx}`" disabled>
                </label>
                <label v-if="q.responseType === 'date'" :for="`demo_date-${qIdx}`">
                    <input type="date" class="demo__date font-small" :value="q.answer" :id="`demo_date-${qIdx}`" disabled>
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
const formattedDemoData = computed(() => {
    if (!props.demographic || !props.demographicData) return [];
    const requestedDemographicQ = props.demographic.filter(q => q.request);

    // map each answer of x participant to the relevan question of the study
    return requestedDemographicQ.map((q) => {
        const response = props.demographicData[q.id];
            return {
                title: q.question,
                required: q.required,
                responseType: q.responseType,
                responseFormat: q[q.responseType],
                answer: response,
            }
    });
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-demographics.scss');
</style>