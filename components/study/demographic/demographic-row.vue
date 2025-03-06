<template>
    <div class="demographic__row">
        <label :for="id" class="demographic__label">
            <span class="demographic__span">{{ config.question }} <span class="demographic__required" v-if="config.required">*</span></span>
            <span class="demographic__slider" :class="{ 'demographic__slider--active': requestModel }">
                <span class="demographic__thumbnail" :class="{ 'demographic__thumbnail--active': requestModel }"></span>
            </span>
        </label>
        <input type="checkbox" v-model="requestModel" name="" :id="id" class="demographic__checkbox" @change="updatRequest">
        <!--Swap with icon-->
        <button class="demographic__button" @click="toggleQuestionId()">Edit</button>
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
const updatRequest = () => {
    props.config.request = requestModel.value
}

</script>

<style scoped></style>