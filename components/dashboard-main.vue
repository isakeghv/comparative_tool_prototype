<template>
    <aside class="aside">
        <div class="aside__container">
            <Dashboard-newstudy @newstudy="(data) => console.log(data)" />
            <Dashboard-filter @filter="(data) => console.log(data)" />
        </div>
    </aside>
    <StudyBlock @select="(data) => console.log(data)" @edit="(data) => console.log(data)"
        @delete="(data) => console.log(data)" @duplicate="(data) => console.log(data)"
        @export="(data) => console.log(data)" id="555" title="Placeholder title" startDate="10/12/2024"/>

</template>

<script setup>

</script>

<style scoped>
@import url('public/style/pages/dashboard/dashboard.css');
</style>