<template>
	<aside class="aside">
		<div class="aside__container">
			<DashboardNewStudy @newStudy="(id) => emitNewStudy(id)" />
			<DashboardFilter @filter="(study) => { resetToStudies(); filter = study }" :activeFilter="filter" />
			<DashboardSearch @search="(query) => searchStudy(query)" />
		</div>
		<div class="aside__container aside__container--small">
			<button class="aside__button font-normal" @click="toggleSettings">Settings</button>
			<DashboardLogout />
		</div>
	</aside>
	<main class="main">
		<h2 class="main__headline font-h5 font-semi">{{ mainTitle }}</h2>
		<div class="main__grid">

			<div v-if="showSettings" class="settings">
				<button class="settings__button">Delete my account</button>
			</div>

			<template v-else>
			<StudyCard v-for="study in studies" :key="study.id"
				@select="(study) => emitSelectStudy(study)"
				@edit="(study) => emitEditStudy(study)"
				@delete="(study) => emitDeleteStudy(study)"
				@duplicate="(study) => studyDuplicate(study)" :study="study" :status="study.status" :filter="filter"
				@export="(id, format) => handleExport(id, format)"
				:id="study.id"
				:title="study.title"
				:startDate="study.publishedAt"
				:lastEdited="study.lastEdited"
				/>
			</template>
		</div>
		<p class="main__paragraph font-normal" v-if="noStudies">
			You currently have no studies. <button class="main__button font-normal"
				@click="createNewStudy()">Get started now!</button>
		</p>
	</main>
</template>

<script setup>
import { user } from '~/public/script/reactive';
import { search } from '~/public/script/studySearch';
import StudyService from '~/services/studyService';
import ParticipantService from '~/services/participantService';
import { formatResponses } from '~/utils/responseUtils';

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

const createNewStudy = () =>{
	const studyID= crypto.randomUUID();
	emitNewStudy(studyID);
}

// emit them again to reach `Dashboard` component that handles the showing of dashboard and study editor
const emitNewStudy = (id) => emit('newStudy', id);
const emitSelectStudy = (study) => emit('selectStudy', study);
const emitEditStudy = (study) => emit('editStudy', study);
const emitDeleteStudy = (study) => emit('deleteStudy', study);

//computed property being automatically update to display the correct title relative to the selected filter
const mainTitle = computed(() => {
	if (showSettings.value) return 'Settings'; // show settings title when settings are shown
	if (['all', 'completed', 'ongoing', 'draft'].includes(filter.value))
		return `Viewing ${filter.value} studies`;
	return `Viewing ${filter.value}`;
});

const noStudies = computed(() => !studies.value || studies.value.length === 0)

const studyDuplicate = async (originalStudy) => {
	console.log('original study', originalStudy);
	const clone = JSON.parse(JSON.stringify(originalStudy));

	// console.log(clone);
	clone.id = crypto.randomUUID();

	//making sure it is always draft, so published/closed studies are not duplicated
	clone.status = 'draft';

	const index = user.studies.findIndex(s => s.id === originalStudy.id);

	const createReq = await StudyService.createStudy(clone, user.info._id);

	if (!createReq.created) return console.error('Unable to duplicate study');

	if (index !== -1) {
		user.studies.splice(index + 1, 0, clone);
	} else {
		user.studies.push(clone);
	}
};

const searchStudy = (query) => {
	filter.value = 'all';
	const results = search(studies.value, query);

	if (query) studies.value = results;
	else studies.value = computedStudies.value;
}

// showSettings
const showSettings = ref(false);

const toggleSettings = () => {
	showSettings.value = true; // Only true when settings button is clicked
};

const resetToStudies = () => {
	showSettings.value = false; // Reset to studyCard when false
};

const handleExport = async (id, variant) => {
	// console.log(variant);
	// console.log(study);

	// fetch all responses, and store in `studyResponses` ref
	const responses = await ParticipantService.getParticipants(id);
	const study = user.studies.find(s => s.id === id);
	//console.log(study)
	const formatedRes = formatResponses(study, responses)

	if (!formatedRes) return alert("Unable to export responses");

	// console.log(formatedRes)


	// console.log(responses);
	if (variant === 'json') downloadJson(study, formatedRes);

	if (variant === 'csv') downloadCsv(study, formatedRes);
}
</script>

<style scoped>
@import url("public/style/pages/dashboard/dashboard.scss");
</style>
