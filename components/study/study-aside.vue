<template>
    <aside class="aside">
        <Study-back :current="currentConfig" :initial="initialStudy"/>
        <button class="aside__button" @click="changeDisplay('details')">
            Study details
        </button>
        <button class="aside__button" @click="changeDisplay('demographics')">
            Demographics
        </button>
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

<style scoped></style>