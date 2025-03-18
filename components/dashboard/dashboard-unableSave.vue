<template>
    <button class="overlay"  @click="exit()"></button>
    <div class="container">
        <div class="container__header">
            <button class="container__exit" @click="exit()">Exit</button>
        </div>
        <p class="container__paragraph">
            Some required fields are missing. Please check that all required fields, such as "title" in "study details" are filled in.
        </p>
    </div>

</template>

<script setup>
const emit = defineEmits(['exit']);

const exit = ()=>{
    emit('exit');
}
</script>

<style scoped>
@import url('public/style/components/dashboard/dashboard-unableSave.scss');
</style>