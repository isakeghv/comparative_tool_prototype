<template>
    <!-- how the base question is structured -->
    <div class="responses__cont">
        <h2 class="responses__headline font-h5 font-medium">{{ question.question }}</h2>

        <div v-if="respondents === 0">
            No participant records available at the moment.
        </div>

        <div v-else-if="Array.isArray(participantData) && participantData.length === 0">
            No response was submitted for this question.
        </div>

        <div v-else class="artifact__grid">
            <span v-if="question.responseType === 'linear'" class="artifact__container linear__label">{{  question.linear.startLabel }}</span>

                <div v-for="(answer, idx) in participantData" :key="answer.id">
                    <div class="artifact__container">
                        <label v-if="['radio', 'checkbox'].includes(question.responseType)" v-for="answer in participantData" :key="answer.id">
                        <input :type="question.responseType" :name="answer.id" checked class="option" tabindex="-1" />
                    </label>

                    <StudyArtifact 
                        v-if="question.artifacts.find(a => a.id === answer.id)"
                        :source="question.artifacts.find(a => a.id === answer.id).source"
                        :alt="answer.id"
                    />

                    <div class="artifact__footer">
                        <p class="artifact__id" v-if="showArtifactId === idx">{{ answer.id }}</p>
                        <div class="artifact__row">
                            <label :for="`artifact_id-${idx}_input`" class="artifact__label">
                                <span class="artifact__span">ID:</span>
                            </label>
                            <input
                                type="text"
                                :id="`artifact_id-${idx}_input`"
                                class="artifact__input artifact__input--small font-small"
                                :value="answer.id"
                                readonly
                                @mouseover="showArtifactId = idx"
                                @mouseleave="showArtifactId = null"
                            />
                        </div>
                    </div>
                </div>

                <span v-if="question.responseType === 'drop'" class="font-small drop__label" style="margin-bottom: 0.4rem;">{{ answer.label }}</span>
            </div>

            <span v-if="question.responseType === 'linear'" class="artifact__container linear__label">{{ question.linear.endLabel }}</span>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    question: Object,
    participantData: Object,
    respondents: Number
});

const showArtifactId = ref(false);

</script>

<style scoped>
    @import url('public/style/components/responses/responses-template.scss');
    @import url('public/style/components/study/study-main.scss');
</style>
    