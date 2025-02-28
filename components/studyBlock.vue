<template>
    <div class="card">
        <img src="" alt="thumbnail of study" class="card__img">
        <h3 class="card__title">{{ title }}</h3>
        <p class="card__paragraph">Started: {{ startDate }}.</p>
        <button class="card__select" aria-label="Open study" @click="studySelect(id)"></button>
        <button class="card__button" aria-label="Open toolbar">
            <div class="card__dot"></div>
        </button>
        <div class="popup">
            <button class="popup__button" @click="studySelect(id)">Open</button>
            <button class="popup__button" @click="studyEdit(id)">Edit</button>
            <button class="popup__button" @click="studyDelete(id)">Delete</button>
            <button class="popup__button" @click="studyDuplicate(id)">Duplicate</button>
            <button class="popup__button" @click="studyExport(id, 'json')">Export JSON</button>
            <button class="popup__button"  @click="studyExport(id, 'cvs')">Export CVS</button>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    title: String,
    startDate: String,
    id: String,
    status: String
})

//Defining events to emit
const emit = defineEmits(['select', 'delete', 'edit', 'duplicate', 'export'])

//emitting study id with "select" event
const studySelect = (id) =>{
    emit('select', id);
}

//emitting study id with "delete" event
const studyDelete = (id) =>{
    emit('delete', id);
}

//emitting study id with "edit" event
const studyEdit = (id) =>{
    emit('edit', id);
}

//emitting study id with "duplicate" event
const studyDuplicate = (id) =>{
    emit('duplicate', id);
}

//emitting study id and format with "export" event
const studyExport = (id, format) =>{
    emit('export', {id, format});
}

</script>

<style scoped>
@import url('public/style/components/studyBlock/studyBlock.css');
</style>