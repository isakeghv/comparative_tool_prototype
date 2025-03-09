<template>
    <button class="demographic__button font-small font-semi" @click="newDemogrQuestion()">
        Add new question
    </button>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const emit = defineEmits(['newQuestion'])

const config = {
    id: crypto.randomUUID(),
    question: 'New question',
    request: true,
    responseType: null,
    options: [],
    required: true,
    range: { min: null, max: null }
}

const newDemogrQuestion = () => {
    study.demographic.push(config);
    emit('newQuestion', config.id)
}

</script>

<style scoped>
    @import url('public/style/components/demographics/_demographics.scss');
</style>