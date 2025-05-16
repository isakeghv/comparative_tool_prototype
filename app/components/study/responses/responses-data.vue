<template>
    <div class="demographic demographic__container">
        <div style="display: flex; gap: 0.8rem; justify-content: space-between;">
            <div>
                <h2 class="demographic__headline font-h5 font-semi">Study data</h2>
                <div class="demographic__main">
                    <div class="row"><span>Study start</span> {{ formatDate(study.publishedAt) || '—' }}</div>
                    <div class="row"><span>Study end</span> {{ studyClosingMethod || '—' }}</div>
                    <div class="row"><span>Last modified</span> {{ formatDate(study.lastEdited) || '—' }}</div>
                    <div class="row"><span>Total</span> {{ studyResponses.length || 0 }}</div>
                    <div class="row"><span>Completed</span> {{ completed.length || 0 }}</div>
                    <div class="row"><span>Partial</span> {{ partialCount || 0 }}</div>
                    <div class="row"><span>Desired</span> {{ completed.length || 0 }} / {{ study.desiredResponses || '-' }}</div>
                    <div class="row"><span>Completion rate</span> {{ studyResponses.length > 0 ? completionRate : 'N/A' }}</div>
                    <div class="row"><span>Completion time</span> {{ studyResponses.length > 0 ? avgCompletionTime : 'N/A' }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const studyResponses = inject('studyResponses');

// get how many participants completed the study
const completed = computed(() => studyResponses.value.filter(item => item.status === 'completed'));

// just do total - completed to get how many partially answered the study
const partialCount = studyResponses.value.length - completed.value.length;

const avgCompletionTime = computed(() => {
    if (completed.value.length === 0) return 'N/A';

    // get the total time of all participants that completed / participants that completed
    const avgCompletionTimeMs = completed.value.reduce((acc, curr) => acc + curr.timeTaken, 0) / completed.value.length;

    // convert to minutes and seconds
    const minutes = Math.floor(avgCompletionTimeMs / 60000);
    const seconds = Math.round((avgCompletionTimeMs % 60000) / 1000);
    const formattedTime = `${minutes}m ${seconds}s`;

    return formattedTime;
});


const completionRate = computed(() => {
    const rate = Math.floor((completed.value.length / studyResponses.value.length) * 100);
    return `${rate}%`
});

const formatDate = (initialDate) => {
    return new Date(initialDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}
const studyClosingMethod = computed(() => {
    // if not closing method has been set by user, return null
    if (study.closingMethod.length === 0) return null;
    
    // access the first `closingLimit` option that has been chosen
    const closingMethod = study.closingMethod[0];
    const closingLimit = study.closingLimit[closingMethod];

    if (!closingLimit) return null;

    if (closingMethod === 'responses') return `${closingLimit} responses`;
    if (closingMethod === 'duration') return formatDate(Number(closingLimit['timestamp']));
    return formatDate(closingLimit);
});
</script>

<style scoped>
    @import url('public/style/components/study/study-main.scss');
    @import url('public/style/components/demographics/demographics.scss');

    .row {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-right: 1rem;
        margin: 1rem 0;
    }
</style>