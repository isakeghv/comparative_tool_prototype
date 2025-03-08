<template>
    <button class="study__filter font-normal" @click="filterView(filter)" v-for="filter in filters">
        View {{ filter }}
    </button>
</template>

<script setup>

//the possible filters to use and emit
const filters = [ 'all', 'completed', 'ongoing', 'draft']

const emit = defineEmits(['filter'])

//Emits the filter to dashboard-main for which studies to display
const filterView = (filter) =>{
    emit('filter', filter);
}


</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-main-aside.scss');
</style>