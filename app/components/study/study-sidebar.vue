<template>
    <aside class="sidebar">
        <StudyReturn :current="currentConfig" :initial="initialStudy" />
        <div class="sidebar__top">
        <button class="sidebar__button font-normal"
            :class="{ 'sidebar__button--active': activeTab === 'details', 'error': errorMsgs.includes('noTitle') }"
        @click="changeDisplay('details')">
            Study details
        </button>
        <button v-if=isDisabled class="sidebar__button font-normal" :class="{ 'sidebar__button--active': activeTab === 'data' }" @click="changeDisplay('data')">
            Study data
        </button>
        <button class="sidebar__button font-normal"
            :class="{ 'sidebar__button--active': activeTab === 'demographics', 'error': errorMsgs.includes('demographics') }"
        @click="changeDisplay('demographics')">
            Demographics
        </button>
        <button class="sidebar__button font-normal"  :class="{ 'sidebar__button--active': activeTab === 'terms' }" @click="changeDisplay('terms')" id="consent-form-button">
            Consent form
        </button>
        </div>
        <StudyList @select="(data) => changeDisplay(data.query, data.number, data.id)"
            :activeQuestionId="activeQuestionId" />
    </aside>
</template>

<script setup>
import { study, initialStudy, errorMsgs, errorQuestions } from '~/public/script/reactive';
import { removeErr } from '~/utils/studyValidator';
const isDisabled = inject('disabled');

const currentConfig = computed(() => {
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

const props = defineProps({
    newActiveQuestionID: {type: String, default: undefined},
})

const activeTab = ref('details');
const activeQuestionId = ref(null);
const responseMode = ref(false);
const emit = defineEmits(['swapDisplay'])

const previousTab = ref(null);
const previousQuestionId = ref(null);

const removeErrOnClick = (component, id = null) => {
    const errorMap = {
        details: 'noTitle',
        demographics: 'demographics',
    };
    
    const errorKey = errorMap[component];
    if (errorKey) return removeErr(true, errorKey);
    
    if (component === 'question') {
        delete errorQuestions[id];
        return;
    }
}

//emitting, so the correct component is displayed in "study-create"
const changeDisplay = (component, number = null, id = null) => {
    removeErrOnClick(previousTab.value, previousQuestionId.value);
 
    activeTab.value = component;
    
    // used to detect which question to give an active color to
    component === 'question' ? activeQuestionId.value = id : activeQuestionId.value = null;

    // remove error indication after clicking on an affected button
    removeErrOnClick(component, id);
    
    previousTab.value = component;
    previousQuestionId.value = id;
    
    emit('swapDisplay', { component, number, id });
};

watch(
    () => props.newActiveQuestionID,
    (id) => { 
        if (id !== undefined) activeQuestionId.value = id; 
        else activeQuestionId.value = null;
    },
    { deep: true }
)

</script>

<style scoped>
@import url('public/style/components/study/study-sidebar.scss');
</style>