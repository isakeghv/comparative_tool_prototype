<template>
	<aside class="aside">
		<div class="aside__container">
			<DashboardNewStudy @newStudy="(id) => emitNewStudy(id)" />
			<DashboardFilter @filter="(study) => (filter = study)" :activeFilter="filter" />
			<DashboardSearch @search="(query) => searchStudy(query)" />
		</div>
		<div class="aside__container aside__container--small">
			<button class="aside__button font-normal">Settings</button>
			<DashboardLogout />
		</div>
	</aside>
	<main class="main">
		<h2 class="main__headline font-h5 font-semi">{{ mainTitle }}</h2>
		<div class="main__grid">
			<!-- showing the create date instead of start date is temporary -->
			<StudyCard v-for="study in studies" :key="study.id"
				@select="(study) => emitSelectStudy(study)"
				@edit="(study) => emitEditStudy(study)"
				@delete="(study) => emitDeleteStudy(study)"
				@duplicate="(study) => studyDuplicate(study)" :study="study" :status="study.status" :filter="filter"
				@export="(study) => console.log(study)" :id="study.id" :title="study.title"
				:startDate="study.publishedAt"
				:lastEdited="study.lastEdited"
				/>
		</div>
	</main>
</template>

<script setup>
import { user } from '~/public/script/reactive';
import { search } from '~/public/script/studySearch';

//Setting variable to store which filter to use for which studies to display. Setting default to 'all' so all
//studies are displayed as default. This is passed to "StudyBlock" with the :filter attr
const filter = ref('all');

const studies = ref();

//to return array of studies to display saved in a reactive variable
const computedStudies = computed(() => {
	return user.studies;
});

studies.value = computedStudies.value;

const emit = defineEmits(['newStudy', 'selectStudy', 'editStudy', 'deleteStudy']);

// emit them again to reach `Dashboard` component that handles the showing of dashboard and study editor
const emitNewStudy = (id) => emit('newStudy', id);
const emitSelectStudy = (study) => emit('selectStudy', study);
const emitEditStudy = (study) => emit('editStudy', study);
const emitDeleteStudy = (study) => emit('deleteStudy', study);

//computed property being automatically update to display the correct title relative to the selected filter
const mainTitle = computed(() => {
	if (['all', 'completed', 'ongoing', 'draft'].includes(filter.value))
		return `Viewing ${filter.value} studies`;
	return `Viewing ${filter.value}`;
});

//to return array of studies to display saved in a reactive variable
// const studies = computed(() => {
// 	return user.studies;
// });

const studyDuplicate = (originalStudy) => {
    const clone = JSON.parse(JSON.stringify(originalStudy));
    clone.id = `${originalStudy.id}_copy_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

    const index = user.studies.findIndex(s => s.id === originalStudy.id);
    if (index !== -1) {
        user.studies.splice(index + 1, 0, clone);
    } else {
        user.studies.push(clone);
    }
};

const searchStudy = (query) =>{
	filter.value = 'all';
	const results = search(studies.value, query);

	if (query) studies.value = results;
	else studies.value = computedStudies.value;
}
</script>

<style scoped>
	@import url("public/style/pages/dashboard/dashboard.scss");
</style>
