<template>
    <div class="overlay" @click="exit()"></div>
    <div class="modal">
        <div class="modal__header">
            <button class="modal__exit" @click="exit()">
                <svg xmlns="http://www.w3.org/2000/svg" class="modal__cross" viewBox="0 -960 960 960">
						<path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
				</svg>
            </button>
        </div>
        <p class="modal__paragraph">
            {{  message }}
        </p>
    </div>

</template>

<script setup>
const props = defineProps({
    errors: Array,
    // reason: String
});

const emit = defineEmits(['exit']);

const exit = () => {
    emit('exit');
}

// const message = computed(() => {
//     if (props.reason === 'save') {
//         return 'You need to save your changes before publishing';
//     } else {
//         return 'Some required fields are missing. Please ensure that the study details include a title for example.';
// }});

// need to override the body styling due to scrollbar gutter
onMounted(() => {
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollBarWidth}px`; 
});

// restore scrolling
onBeforeUnmount(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
});
</script>

<style scoped>
@import url('public/style/components/dashboard/dashboard-unableSave.scss');
</style>