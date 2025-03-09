<template>
    <div class="demographic__row">
        <label :for="id" class="demographic__label">
            <span class="demographic__span font-normal">{{ config.question }} <span class="demographic__required" v-if="config.required">*</span></span>
        </label>
        <span class="demographic__slider" :class="{ 'demographic__slider--active': requestModel }">
            <span class="demographic__thumbnail" :class="{ 'demographic__thumbnail--active': requestModel }"></span>
        </span>
        <input type="checkbox" v-model="requestModel" name="" :id="id" class="demographic__checkbox" @change="updateRequest">
        <!--Swap with icon-->
        <button class="demographic__more" @click="toggleQuestionId()">
            <svg class="demographic__svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z"/>
            </svg>
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    config: Object,
    index: Number
})

const emit = defineEmits(['edit'])

//giving checkboxes and labels their own id
const id = computed(()=>{
    return String(crypto.randomUUID())
})

//emitting if of question to edit
const toggleQuestionId = () =>{
    emit('edit', props.config.id)

}

const requestModel = ref(props.config.request);

//updating in config if question should be asked or not
const updateRequest = () => {
    props.config.request = requestModel.value
}

</script>

<style scoped>
    @import url('public/style/components/demographics/_demographics.scss');
</style>