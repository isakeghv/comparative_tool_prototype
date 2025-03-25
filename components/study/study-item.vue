<template>
    <li class="question__item" ref="itemRef" :draggable="draggableItem" @drop="drop" @dragstart="dragStart"
        @dragover.prevent>
        <button class="question__button font-normal" @click="displayQuestion">
            <span class="question__number">{{ number }}</span>
            <span class="question__text">{{ questionText }}</span>
        </button>
        <!--span is outside button so button is not autatically clicked if it is dragged to re-arrange the order-->
        <span class="question__drag" @mousedown="setDraggable(true)">
            <svg class="question__svg" xmlns="http://www.w3.org/2000/svg"viewBox="0 -960 960 960">
                <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
            </svg>
        </span>
    </li>
</template>

<script setup>
import { study } from '~/public/script/reactive';

const props = defineProps({
    index: Number,
    config: Object,
    parent: String,
})

const itemRef = ref('')
const draggableItem = ref(false);

//setting up event-emit so the correct display is toggled in the create-study main area
const emit = defineEmits(['select'])

//handles which number is displyed with the question
const number = computed(() => {
    if (props.index || props.index === 0) return `${props.index + 1}. `
    return ''
})

//to handle so the displayed content in the main-area is the selected question
const displayQuestion = () => {
    emit('select', { query: 'question', number: props.index, id: props.config.id });
}

const questionText = computed(() => {
    if (props.config && props.config.question) return props.config.question;
    return 'Empty'
})

//logic below handles so the items are draggable by dragging the "question__drag", to change order of the questions
const setDraggable = (boolean) => {
    draggableItem.value = boolean;

    //does so list item is not draggable once item is dropped
    if (boolean) document.addEventListener('mouseup', setDraggableFalse);

    //removing eventlistener so not several are added
    else document.removeEventListener('mouseup', setDraggableFalse);
};

//calls draggabble function to reset draggability of item
const setDraggableFalse = () => setDraggable(false);

const dragStart = (event) => {
    event.dataTransfer.setData('index', props.index);
};

const drop = (event) => {
    const fromIndex = event.dataTransfer.getData('index');
    const toIndex = props.index;

    if (fromIndex !== toIndex) {
        [study.questions[fromIndex], study.questions[toIndex]] =
            [study.questions[toIndex], study.questions[fromIndex]];
    }
};

</script>

<style scoped>
    @import url('public/style/components/study/study-sidebar.scss');
</style>