<template>
    <aside class="sidebar">
        <StudyReturn :current="currentConfig" :initial="initialStudy"/>
        <div class="sidebar__top">
        <button class="sidebar__button font-normal" @click="changeDisplay('details')">
            Study details
        </button>
        <button class="sidebar__button font-normal" @click="changeDisplay('demographics')" :disabled="disableDemographics">
            Demographics
        </button>
        <button class="sidebar__button font-normal" @click="changeDisplay('terms')">
            Consent form
        </button>
        </div>
        <StudyList @select="(data)=>changeDisplay(data.query, data.number, data.id)"/>
    </aside>
</template>

<script setup>
import { study, initialStudy } from '~/public/script/reactive';
const isDisabled = inject('disabled');

// console.log(study.status);
// console.log(study.demographicReq);
const disableDemographics = computed(() => {
    return study.status !== 'draft' && !study.demographicReq;
});

const currentConfig = computed(()=>{
    return {
        title: study.title,
        description: study.description,
        closingMethod: study.closingMethod,
        closingLimit: {
            date: study.closingLimit.date,
            duration: study.closingLimit.duration,
            responses: study.closingLimit.responses
        },
        desiredResponses: study.desiredResponses,
        demographicReq: study.demographicReq,
        demographic: study.demographic,
        customTerms: {
			request: study.customTerms.request,
			terms: study.customTerms.terms,
		},
        questions: study.questions
    }
})

const emit = defineEmits(['swapDisplay'])

//emitting, so the correct component is displayed in "study-create"
const changeDisplay = (component, number = null, id = null) => {
    emit('swapDisplay', { component, number, id })
}


</script>

<style scoped>
    @import url('public/style/components/study/study-sidebar.scss');
</style>