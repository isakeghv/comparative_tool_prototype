<template>
    <button v-if="!isDisabled" class="demographic__button font-small font-semi" @click="newDemogrQuestion()">
        Add new question
    </button>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const emit = defineEmits(['newQuestion'])

// push a new question with a base config
const newDemogrQuestion = () => {
    const config = {
        id: crypto.randomUUID(),
        question: 'New question',
        request: true,
        responseType: 'text',
        required: true,
        text: {
            maxChar: ''
        },
        radio: {
            options: ['']
        },
        number: { 
            min: '',
            max: ''
        }
    }

    study.demographic.push(config);
    emit('newQuestion', config.id)
}

</script>

<style scoped>
    @import url('public/style/components/demographics/demographics.scss');
</style>


