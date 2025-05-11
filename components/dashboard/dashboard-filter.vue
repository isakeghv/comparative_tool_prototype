<template>
    <button class="study__filter font-normal"
    @click="filterView(filter)"
    :class="{ 'study__filter--active': activeFilter === filter }"
    v-for="filter in filters">
        View {{ filter }}
    </button>
</template>

<script setup>

//the possible filters to use and emit
const filters = [ 'all', 'completed', 'ongoing', 'draft']

// get the filter that is active current so it's possible to style it
const props = defineProps({
    activeFilter: String
});

const emit = defineEmits(['filter'])

//Emits the filter to dashboard-main for which studies to display
const filterView = (filter) => {
    emit('filter', filter);
}

</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-sidebar.scss');
</style>
