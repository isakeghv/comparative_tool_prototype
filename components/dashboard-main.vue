<template>
    <aside class="aside">
        <div class="aside__container">
            <Dashboard-newstudy @newstudy="(data) => console.log(data)" />
            <Dashboard-filter @filter="(data) => filter = data" />
        </div>
    </aside>
    <main class="main">
        <h2 class="main__headline">{{ mainTitle }}</h2>
        <div class="main__grid">
            <StudyBlock @select="(data) => console.log(data)" @edit="(data) => console.log(data)"
                @delete="(data) => console.log(data)" @duplicate="(data) => console.log(data)" :status="data.status"
                :filter="filter" @export="(data) => console.log(data)" :id="data.id" :title="data.title"
                :startDate="data.date" v-for="data in studyBlockPlaceholderData" />
        </div>
    </main>

</template>

<script setup>

//Setting variable to store which filter to use for which studies to display. Setting default to 'all' so all
//studies are displayed as default. This is passed to "StudyBlock" with the :filter attr
const filter = ref('all')


//computed property being automatically update to display the correct title relative to the selected filter
const mainTitle = computed(()=>{
    if ((['all', 'completed', 'ongoing']).includes(filter.value)) return `Viewing ${filter.value} studies`;
    return `Viewing ${filter.value}`;
})

const studyBlockPlaceholderData = [
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'completed' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'completed' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'completed' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'completed' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'ongoing' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'drafts' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'ongoing' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'ongoing' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'ongoing' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'drafts' },
    { id: '555', title: 'Placeholder title', date: '10/12/2024', status: 'drafts' },
]

const headlineText = computed(() => {

})

</script>

<style scoped>
@import url('public/style/pages/dashboard/dashboard.css');
</style>