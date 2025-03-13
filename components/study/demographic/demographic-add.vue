<template>
    <button class="demographic__button font-small font-semi" @click="newDemogrQuestion()">
        Add new question
    </button>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const emit = defineEmits(['newQuestion'])

// push a new question with a base config
const newDemogrQuestion = () => {
    const config = {
        id: crypto.randomUUID(),
        question: 'New question',
        request: true,
        responseType: '',
        required: true,
        text: {
            maxWords: 0
        },
        radio: {
            options: []
        },
        number: { 
            min: 0,
            max: 100
        },
        date: {
            year: true,
            month: false,
            day: false
        }
    }

    study.demographic.push(config);
    emit('newQuestion', config.id)
}

</script>

<style scoped>
    @import url('public/style/components/demographics/demographics.scss');
</style>


