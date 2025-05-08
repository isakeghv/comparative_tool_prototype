<template>
    <aside class="sidebar">
        <StudyReturn :current="currentConfig" :initial="initialStudy" />
        <div class="sidebar__top">
            <button class="sidebar__button font-normal" :class="{ 'sidebar__button--active': activeTab === 'details' }"
                @click="changeDisplay('details')">
                Study details
            </button>
            <button v-if=isDisabled class="sidebar__button font-normal"
                :class="{ 'sidebar__button--active': activeTab === 'data' }" @click="changeDisplay('data')">
                Study data
            </button>
            <button class="sidebar__button font-normal"
                :class="{ 'sidebar__button--active': activeTab === 'demographics' }"
                @click="changeDisplay('demographics')">
                Demographics
            </button>
            <button class="sidebar__button font-normal" :class="{ 'sidebar__button--active': activeTab === 'terms' }"
                @click="changeDisplay('terms')">
                Consent form
            </button>
        </div>
        <StudyList @select="(data) => changeDisplay(data.query, data.number, data.id)"
            :activeQuestionId="activeQuestionId" />
    </aside>
</template>

<script setup>
import { study, initialStudy, showResponses } from '~/public/script/reactive';
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

//emitting, so the correct component is displayed in "study-create"
const changeDisplay = (component, number = null, id = null) => {
    activeTab.value = component;

    // used to detect which question to give an active color to
    component === 'question' ? activeQuestionId.value = id : activeQuestionId.value = null;

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