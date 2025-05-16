<template>
    <div class="card" v-if="filterDisplay">
        <img alt="thumbnail of study" class="card__img" :src="filePath"
            v-if="props.study.thumbnail && props.study.thumbnail !== null" @error="onImageError" />
            
        <div class="card__background" v-if="!props.study.thumbnail || props.study.thumbnail === null">
            <svg class="card__svg" viewBox="0 0 365 365" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="365" height="365" fill="#9BD5FF" />
                <path d="M365 365H87.7427L226.372 176L365 365Z" fill="#D9D9D9" />
                <path d="M365.258 365H88L226.629 176L365.258 365Z" fill="url(#paint0_linear_0_1)" fill-opacity="0.26" />
                <path d="M145.354 286.217L87.5688 365H0.439941L101.79 226.823L145.354 286.217Z" fill="#C1C1C1" />
                <path d="M144.914 286.394L87.1289 365.177H0L101.35 227L144.914 286.394Z" fill="url(#paint1_linear_0_1)"
                    fill-opacity="0.39" />
                <circle cx="141.5" cy="137.5" r="19.5" fill="#FFDE3B" />
                <defs>
                    <linearGradient id="paint0_linear_0_1" x1="176.5" y1="211" x2="209.5" y2="271"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFDE3B" />
                        <stop offset="1" stop-color="#D9D9D9" />
                    </linearGradient>
                    <linearGradient id="paint1_linear_0_1" x1="121.5" y1="205.5" x2="99" y2="270.5"
                        gradientUnits="userSpaceOnUse">
                        <stop stop-color="#FFDE3B" />
                        <stop offset="1" stop-color="#C1C1C1" />
                    </linearGradient>
                </defs>
            </svg>
        </div>

        <h3 class="card__title font-medium">{{ title }}</h3>
        <p class="card__paragraph font-small">Updated: {{ formattedStartDate }}</p>
        <button class="card__select" aria-label="Open study" @click="studyEdit(id)"></button>

        <div class="popup-container" ref="popupRef">
            <button class="card__button" aria-label="Open toolbar" @click="showPopUp = !showPopUp">
                <div class="card__dot">
                    <svg xmlns="http://www.w3.org/2000/svg" class="card__svg" viewBox="0 -960 960 960">
                        <path
                            d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" />
                    </svg>
                </div>
            </button>
        </div>
        <div class="popup" v-if="showPopUp">
            <!-- only show 'edit' button if study is a draft -->
            <button v-if="status === 'draft'" class="popup__button font-normal" @click="studyEdit(id)">Edit</button>
            <button class="popup__button font-normal" @click="studyDelete(id)" id="popup-delete-btn">Delete</button>
            <button class="popup__button font-normal" @click="studyDuplicate(study)">Duplicate</button>
            <button v-if="status !== 'draft'" class="popup__button font-normal"
                @click="studyExport(id, 'json')">Export JSON</button>
            <button v-if="status !== 'draft'" class="popup__button font-normal"
                @click="studyExport(id, 'csv')">Export CVS</button>
        </div>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const props = defineProps({
    study: Object,
    title: String,
    startDate: String,
    lastEdited: String,
    id: String,
    status: String,
    filter: String
})

//statemanager. Setting if the pop-up menu should be displayed or not.
const showPopUp = ref(false);
const popupRef = ref(null);

// close popup if click outside the component
const handleClickOutside = (event) => {
    if (popupRef.value && !popupRef.value.contains(event.target)) {
        showPopUp.value = false;
    }
};

const filePath = ref('');

const getFile = async () => {
    if (!props.study.thumbnail) return null;
    const request = await fetch(`/api/serve-file?filename=${encodeURIComponent(props.study.thumbnail)}`);

    if (!request.ok) return null;
    const raw = await request.blob();
    return URL.createObjectURL(raw);
}

onMounted(async () => {
    const fileurl = await getFile();

    if (!fileurl) filePath.value = '';

    filePath.value = `${fileurl}`;
})

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});

//computed property returning a boolean. Checking if "status" is either "all" or same as "props.status". 
// if true, it is used to display the studyblock
const filterDisplay = computed(() => {
    //returning true if no filter has been set
    if (!props.status) return true;

    //returning true if filter is "all" or is the same as status
    return props.filter === 'all' || props.status === props.filter;
})

// format the start date to be readable
const formattedStartDate = computed(() => {
    let date = props.lastEdited;

    // just set current date temporary
    if (!props.lastEdited) date = Date.now();

    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
});

//Defining events to emit
const emit = defineEmits(['select', 'delete', 'edit', 'duplicate', 'export'])

//emitting study id with "delete" event
const studyDelete = (id) => {
    showPopUp.value = false
    emit('delete', id);
}

//emitting study id with "edit" event
const studyEdit = (id) => {
    showPopUp.value = false
    emit('edit', id);
}

const studyDuplicate = (study) => {
    showPopUp.value = false;
    emit('duplicate', props.study);
};


//emitting study id and format with "export" event
const studyExport = (id, format) => {
    showPopUp.value = false
    emit('export', id, format);
}
</script>

<style scoped>
@import url('public/style/components/study/study-card.scss');
</style>