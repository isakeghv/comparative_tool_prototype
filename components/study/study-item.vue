<template>
    <li class="question__item" ref="itemRef" :class="{ 'sidebar__button--active': isActive }" :draggable="draggableItem" @drop="drop" @dragstart="dragStart"
        @dragover.prevent>
        <button class="question__button font-normal" @click="displayQuestion">
            <span class="question__number">{{ number }}</span>
            <span class="question__text">{{ questionText }}</span>
        </button>

        <!-- to duplicate a question, only id changes -->
        <button class="question__duplicate" @click="duplicateQuestion()" aria-label="Duplicate question">
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 3H4C3.44772 3 3 3.44772 3 4V18C3 18.5523 2.55228 19 2 19C1.44772 19 1 18.5523 1 18V4C1 2.34315 2.34315 1 4 1H18C18.5523 1 19 1.44772 19 2C19 2.55228 18.5523 3 18 3Z" fill="#0F0F0F"/>
                    <path d="M13 11C13 10.4477 13.4477 10 14 10C14.5523 10 15 10.4477 15 11V13H17C17.5523 13 18 13.4477 18 14C18 14.5523 17.5523 15 17 15H15V17C15 17.5523 14.5523 18 14 18C13.4477 18 13 17.5523 13 17V15H11C10.4477 15 10 14.5523 10 14C10 13.4477 10.4477 13 11 13H13V11Z" fill="#0F0F0F"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20 5C21.6569 5 23 6.34315 23 8V20C23 21.6569 21.6569 23 20 23H8C6.34315 23 5 21.6569 5 20V8C5 6.34315 6.34315 5 8 5H20ZM20 7C20.5523 7 21 7.44772 21 8V20C21 20.5523 20.5523 21 20 21H8C7.44772 21 7 20.5523 7 20V8C7 7.44772 7.44772 7 8 7H20Z" fill="#0F0F0F"/>
                </svg>
        </button>

        <!--span is outside button so button is not autatically clicked if it is dragged to re-arrange the order-->
        <span v-if="!isDisabled" class="question__drag" @mousedown="setDraggable(true)">
            <svg class="question__svg" xmlns="http://www.w3.org/2000/svg"viewBox="0 -960 960 960">
                <path d="M360-160q-33 0-56.5-23.5T280-240q0-33 23.5-56.5T360-320q33 0 56.5 23.5T440-240q0 33-23.5 56.5T360-160Zm240 0q-33 0-56.5-23.5T520-240q0-33 23.5-56.5T600-320q33 0 56.5 23.5T680-240q0 33-23.5 56.5T600-160ZM360-400q-33 0-56.5-23.5T280-480q0-33 23.5-56.5T360-560q33 0 56.5 23.5T440-480q0 33-23.5 56.5T360-400Zm240 0q-33 0-56.5-23.5T520-480q0-33 23.5-56.5T600-560q33 0 56.5 23.5T680-480q0 33-23.5 56.5T600-400ZM360-640q-33 0-56.5-23.5T280-720q0-33 23.5-56.5T360-800q33 0 56.5 23.5T440-720q0 33-23.5 56.5T360-640Zm240 0q-33 0-56.5-23.5T520-720q0-33 23.5-56.5T600-800q33 0 56.5 23.5T680-720q0 33-23.5 56.5T600-640Z"/>
            </svg>
        </span>
    </li>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const props = defineProps({
    index: Number,
    config: Object,
    parent: String,
    isActive: Boolean
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
    return '';
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

// duplicate question
const duplicateQuestion = () => {
  // clone the original question
  const original = props.config;
  const clone = JSON.parse(JSON.stringify(original));

  // Generate a new unique ID (for simplicity, using Date.now + random)
  clone.id = `${original.id}_copy_${Date.now().toString(36)}${Math.random().toString(36).substring(2, 6)}`;

  // Insert the clone right after the original
  study.questions.splice(props.index + 1, 0, clone);
};

</script>

<style scoped>
    @import url('public/style/components/study/study-sidebar.scss');
</style>