<template>
    <div class="card" v-if="filterDisplay">
        <img src="" alt="thumbnail of study" class="card__img">
        <h3 class="card__title font-medium">{{ title }}</h3>
        <p class="card__paragraph font-small">Started: {{ startDate }}.</p>
        <button class="card__select" aria-label="Open study" @click="studySelect(id)"></button>
        <button class="card__button" aria-label="Open toolbar" @click="showPopUp = !showPopUp">
            <div class="card__dot"></div>
        </button>
        <div class="popup" v-if="showPopUp">
            <button class="popup__button font-normal" @click="studySelect(id)">Open</button>
            <button class="popup__button font-normal" @click="studyEdit(id)">Edit</button>
            <button class="popup__button font-normal" @click="studyDelete(id)">Delete</button>
            <button class="popup__button font-normal" @click="studyDuplicate(id)">Duplicate</button>
            <button class="popup__button font-normal" @click="studyExport(id, 'json')">Export JSON</button>
            <button class="popup__button font-normal"  @click="studyExport(id, 'cvs')">Export CVS</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
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

//Defining events to emit
const emit = defineEmits(['select', 'delete', 'edit', 'duplicate', 'export'])

//emitting study id with "select" event
const studySelect = (id) =>{
    showPopUp.value = false
    emit('select', id);

}

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
const studyDuplicate = (id) =>{
    showPopUp.value = false
    emit('duplicate', id);
}

//emitting study id and format with "export" event
const studyExport = (id, format) =>{
    showPopUp.value = false
    emit('export', {id, format});
}

</script>

<style scoped>
@import url('public/style/components/studyBlock/studyBlock.scss');
</style>