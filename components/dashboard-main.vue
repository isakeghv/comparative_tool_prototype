<template>
  <aside class="aside">
    <div class="aside__container">
      <Dashboard-newStudy @newStudy="(study) => console.log(study)" />
      <Dashboard-filter @filter="(study) => (filter = study)" />
    </div>
    <div class="aside__container aside__container--small">
      <button class="aside__button">Settings</button>
      <Dashboard-logout />
    </div>
  </aside>
  <main class="main">
    <h2 class="main__headline">{{ mainTitle }}</h2>
    <div class="main__grid">

    <!-- showing the create date instead of start date is temporary -->
    <StudyBlock v-for="study in studies" :key="study._id"
        @select="(study) => console.log(study)"
        @edit="(study) => console.log(study)"
        @delete="(study) => console.log(study)"
        @duplicate="(study) => console.log(study)"
        :status="study.status"
        :filter="filter"
        @export="(study) => console.log(study)"
        :id="study._id"
        :title="study.title"
        :startDate="study.created"
    />
    </div>
  </main>
</template>

<script setup>
import { user } from "~/public/script/reactive";

//Setting variable to store which filter to use for which studies to display. Setting default to 'all' so all
//studies are displayed as default. This is passed to "StudyBlock" with the :filter attr
const filter = ref("all");

//computed property being automatically update to display the correct title relative to the selected filter
const mainTitle = computed(() => {
  if (["all", "completed", "ongoing", "draft"].includes(filter.value))
    return `Viewing ${filter.value} studies`;
  return `Viewing ${filter.value}`;
});

//to return array of studies to display saved in a reactive variable
const studies = computed(() => {
  return user.studies;
});
</script>

<style scoped>
@import url("public/style/pages/dashboard/dashboard.css");
</style>
