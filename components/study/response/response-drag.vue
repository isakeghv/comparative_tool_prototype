<template>
    <div class="aside__container">
        <fieldset class="aside__fieldset">
            <div class="aside__selection">
                <input type="radio" value="drag" name="question_drag" id="question_drag" class="aside__radio" v-model="responseModel">
                <label for="question_drag" class="aside__label aside__label--headline font-normal font-medium">
                    Drag and drop
                </label>
            </div>
            <div class="aside__options" v-if="isDragResponse">
                <div class="aside__option" v-for="(dropBox, i) in dropBoxModel" :key="index">
                <label :for="`dropBox_${dropBox}_${i}_txt`" class="aside__label">Drop-box</label>
                <input type="text" :id="`dropBox_${dropBox}_${i}_txt`" class="aside__input" v-model="dropBoxModel[i]">
                <button class="aside__button aside__button--option" @click="deleteDropBox(i)">Delete</button>
            </div>
                <button class="aside__button aside__button--add" @click="addDropBox()">Add drop-box</button>
            </div>
        </fieldset>
    </div>
</template>

<script setup>
// accepting the selected question as a prop to read and store values from
const props = defineProps({
    selectedQuestion: Object
});

const dropBoxModel = ref(props.selectedQuestion?.drag?.dropBoxes || []);
const isDragResponse = computed(() => props.selectedQuestion?.type === 'drag');

// copy from earlier functions
const addDropBox = () => {
    if (!props.selectedQuestion.drag.dropBoxes) {
        props.selectedQuestion.drag.dropBoxes = [];
    }

    props.selectedQuestion.drag.dropBoxes.push('');
    dropBoxModel.value = props.selectedQuestion.drag.dropBoxes;
};

const deleteDropBox = (index) => {
    dropBoxModel.value.splice(index, 1);
    props.selectedQuestion.drag.dropBoxes = dropBoxModel.value;
};
</script>

<style scoped>
    @import url('public/style/components/study/study-aside.scss');
</style>