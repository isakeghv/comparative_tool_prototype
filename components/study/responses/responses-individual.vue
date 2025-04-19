<template>
    <!-- how the base question is structured -->
    <div class="responses__cont">
        <h2 class="responses__headline font-h5 font-medium">{{ question.question }} {{ question.required ? '*' : '' }}</h2>
    
        <!-- No participant records available at the moment. (if none has answered)
         If partial submission 'This question hasn’t been answered yet.'' -->

        <div v-if="Array.isArray(participantData) && participantData.length === 0">
            No response were submitted for this question.
        </div>


        <div v-else class="artifact__grid">
            <span v-if="question.responseType === 'linear'" class="artifact__container linear__label">{{  question.linear.startLabel }}</span>

            <div v-for="answer in participantData" :key="answer.id" class="artifact__container" :title="answer.id">
                <label v-if="['radio', 'checkbox'].includes(question.responseType)" v-for="answer in participantData" :key="answer.id">
                    <input :type="question.responseType" :name="answer.id" checked class="option" disabled />
                </label>
                <StudyArtifact 
                    v-if="question.artifacts.find(a => a.id === answer.id)"
                    :source="question.artifacts.find(a => a.id === answer.id).source"
                    :alt="answer.id"
                    :rounded="question.responseType !== 'drop'"
                />

                <div v-if="question.responseType === 'drop'"class="drop__label">{{ answer.label }}</div>
            </div>

            <span  v-if="question.responseType === 'linear'" class="artifact__container linear__label">{{  question.linear.endLabel }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    question: Object,
    participantData: Object
});
</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
</style>
    