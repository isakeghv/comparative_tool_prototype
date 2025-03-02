<template>
    <header class="header">
        <h1 class="header__headline font-heavy font-h3">Compara</h1>
        <p class="header__paragraph font-normal" v-if="!id && name">
            Welcome, <span class="header__span font-heavy">{{ name }}</span>!
        </p>
    </header>
</template>

<script setup>
const props = defineProps({
    name: String,
    id: {
        type: [String, Number]
    }
})

</script>

<style scoped>
    @import url('public/style/components/header/dashboard-header.css');
</style>