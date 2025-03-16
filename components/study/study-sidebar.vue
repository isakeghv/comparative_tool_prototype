<template>
    <aside class="sidebar">
        <Study-return :current="currentConfig" :initial="initialStudy"/>
        <div class="sidebar__top">
        <button class="sidebar__button font-normal" @click="changeDisplay('details')">
            Study details
        </button>
        <button class="sidebar__button font-normal" @click="changeDisplay('demographics')">
            Demographics
        </button>
        <button class="sidebar__button font-normal" @click="changeDisplay('terms')">
            Terms and policy
        </button>
        </div>
        <Study-list @select="(data)=>changeDisplay(data.query, data.number, data.id)"/>
    </aside>
</template>

<script setup>
import { study, initialStudy } from '~/public/script/reactive';

const currentConfig = computed(()=>{
    return {
        questions: study.questions,
        demographicReq: study.demographicReq,
        demographic: study.demographic,
        description: study.description,
        title: study.title
    }
})

const emit = defineEmits(['swapDisplay'])

//emitting, so the correct component is displayed in "study-create"
const changeDisplay = (component, number = null, id=null) => {
    emit('swapDisplay', { component, number, id })
}


</script>

<style scoped>
    @import url('public/style/components/study/_study-sidebar.scss');
</style>