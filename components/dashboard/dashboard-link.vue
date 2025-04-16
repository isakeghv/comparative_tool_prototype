<template>
    <div class="link__cont">
        <button class="header__button" :data-tooltip="!isModalOpen ? 'Link' : null" @click="isModalOpen = !isModalOpen">
            <svg class="header__icon" viewBox="0 -960 960 960" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M680-80q-50 0-85-35t-35-85q0-6 3-28L282-392q-16 15-37 23.5t-45 8.5q-50 0-85-35t-35-85q0-50 35-85t85-35q24 0 45 8.5t37 23.5l281-164q-2-7-2.5-13.5T560-760q0-50 35-85t85-35q50 0 85 35t35 85q0 50-35 85t-85 35q-24 0-45-8.5T598-672L317-508q2 7 2.5 13.5t.5 14.5q0 8-.5 14.5T317-452l281 164q16-15 37-23.5t45-8.5q50 0 85 35t35 85q0 50-35 85t-85 35Z"/>
            </svg>
        </button>

        <!-- modal when clicking on the 'link' button in header-->
        <div class="link__backdrop" v-if="isModalOpen" @click="closeModal"></div>
        <div class="link__modal" v-if="isModalOpen">
            <p v-if="study.status === 'draft'">This study is currently unpublished, and is not open for responses.</p>
            <div v-else-if="study.status === 'ongoing' || study.status === 'completed'" class="link__content">
                <span class="font-normal">Get participant link</span>
                <input
                    ref="studyLink"
                    :value="studyUrl"
                    readonly
                    class="link__input"
                    id="copy"
                />
                <a class="font-small link__copy" @click="copyLink" >Copy</a>
            </div>
        </div>
    </div>
</template>  

<script setup>
// get status of study as a prop
const props = defineProps({
    study: Object
});

const isModalOpen = ref(false);

// close when clicked outside (using an imported directive)
const closeModal = () => {
    isModalOpen.value = false;
};

// construct study url, and insert it in a read-only input
const studyLink = ref(null);
const baseUrl = window.location.origin;
const studyUrl = computed(() => `${baseUrl}/studies/${props.study.id}`);


// show alert when successfully copied url
const copyLink = () => {
  navigator.clipboard.writeText(studyUrl.value)
    .then(() => alert('Link copied to clipboard!'))
    .catch(_err => console.error('Failed to copy link. Please try again.'));
};

console.log(props.study);
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-header.scss');
</style>