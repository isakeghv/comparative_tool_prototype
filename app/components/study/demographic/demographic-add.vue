<template>
    <button v-if="!isDisabled" class="demographic__button font-small font-semi" @click="newDemogrQuestion()" :disabled="hasMaxQuestions">
        Add new question
    </button>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const emit = defineEmits(['newQuestion'])

const hasMaxQuestions = computed(() => {
    return study.demographic.length >= 20;
});

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

    // return if adding more than 20 questions
    if (hasMaxQuestions.value) return;

    study.demographic.push(config);
    emit('newQuestion', config.id)
}

</script>

<style scoped>
    @import url('public/style/components/demographics/demographics.scss');
</style>


