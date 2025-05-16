<template>
    <div class="link__cont">
        <button class="header__button" :data-tooltip="!isModalOpen ? 'Link' : null" @click="isModalOpen = !isModalOpen">
            <svg class="header__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path
                    d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" />
            </svg>
        </button>

        <div class="link__backdrop" v-if="isModalOpen" @click="closeModal"></div>
        <div class="header__absolute" v-if="isModalOpen">
        <button class="export__button font-small" @click="exportResponses('json')">Export JSON</button>
            <button class="export__button font-small" @click="exportResponses('csv')">Export CSV</button>
        </div>
    </div>
</template>  

<script setup>
import { downloadJson, downloadCsv } from '~/utils/responseUtils';
import ParticipantService from '~/services/participantService';

// get status of study as a prop
const props = defineProps({
    study: Object
});

const isModalOpen = ref(false);

// close when clicked outside (using an imported directive)
const closeModal = () => {
    isModalOpen.value = false;
};

const exportResponses = async (variant) => {
    isModalOpen.value = false;

    const id = props.study.id;

    const responses = await ParticipantService.getParticipants(id);
	const formatedRes = formatResponses(props.study, responses)

	if (!formatedRes) return alert("Unable to export responses");

	if (variant === 'json') downloadJson(props.study, formatedRes);
	if (variant === 'csv') downloadCsv(props.study, formatedRes);
}
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-header.scss');
</style>