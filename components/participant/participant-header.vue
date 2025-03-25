<template>
    <header class="header">
        <h1 class="header__headline font-heavy font-h3">Compara</h1>
        <div class="header__container">
            <div class="header__progress" v-if="start">

            </div>
        </div>
    </header>
</template>

<script setup>
const props = defineProps({
    start: {
        type: Boolean,
        default: false,
    },
});

const study = ref({
    id: 123,
    published: true
});
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-header.scss');
</style>
