<template>
    <button class="study__filter" @click="filterView(filter)" v-for="filter in filters">
        View {{ filter }}
    </button>
</template>

<script setup>

//the possible filters to use and emit
const filters = [ 'all', 'completed', 'ongoing', 'drafts']

const emit = defineEmits(['filter'])

//Emits the filter to dashboard-main for which studies to display
const filterView =(filter) =>{
    emit('filter', filter);
}


</script>

<style scoped>
    @import url('public/style/components/aside/dashboard-main-aside.css');
</style>