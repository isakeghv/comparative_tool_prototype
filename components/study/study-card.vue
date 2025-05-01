<template>
    <div class="card" v-if="filterDisplay">
        <!-- <img src="" alt="thumbnail of study" class="card__img"> -->
        <!-- just for now -->
        <div alt="thumbnail of study" class="card__img"></div>
        <h3 class="card__title font-medium">{{ title }}</h3>
        <p class="card__paragraph font-small">Started: {{ formattedStartDate }}</p>
        <button class="card__select" aria-label="Open study" @click="studyEdit(id)"></button>
        <button class="card__button" aria-label="Open toolbar" @click="showPopUp = !showPopUp">
            <div class="card__dot">
                <svg xmlns="http://www.w3.org/2000/svg" class="card__svg" viewBox="0 -960 960 960">
                    <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
                </svg>
            </div>
        </button>
        <div class="popup" v-if="showPopUp">
            <!-- only show 'edit' button if study is a draft -->
            <button v-if="status === 'draft'" class="popup__button font-normal" @click="studyEdit(id)">Edit</button>
            <button class="popup__button font-normal" @click="studyDelete(id)">Delete</button>
            <button class="popup__button font-normal" @click="studyDuplicate(study)">Duplicate</button>
            <button class="popup__button font-normal" @click="studyExport(id, 'json')">Export JSON</button>
            <button class="popup__button font-normal"  @click="studyExport(id, 'cvs')">Export CVS</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    study: Object,
    title: String,
    startDate: String,
    id: String,
    status: String,
    filter: String
})

//statemanager. Setting if the pop-up menu should be displayed or not.
const showPopUp = ref(false);

//computed property returning a boolean. Checking if "status" is either "all" or same as "props.status". 
// if true, it is used to display the studyblock
const filterDisplay = computed(()=>{
    //returning true if no filter has been set
    if (!props.status) return true;

    //returning true if filter is "all" or is the same as status
    return props.filter === 'all' || props.status === props.filter;
})

// format the start date to be readable
const formattedStartDate = computed(() => {
    if (!props.startDate) return 'N/A';
    
    return new Date(props.startDate).toLocaleDateString('en-US', {
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
const studyEdit = (id) =>{
    showPopUp.value = false
    emit('edit', id);
}

//emitting study id with "duplicate" event
const studyDuplicate = (study) =>{
    showPopUp.value = false
    emit('duplicate', study);
}

//emitting study id and format with "export" event
const studyExport = (id, format) =>{
    showPopUp.value = false
    emit('export', {id, format});
}

</script>

<style scoped>
@import url('public/style/components/study/study-card.scss');
</style>