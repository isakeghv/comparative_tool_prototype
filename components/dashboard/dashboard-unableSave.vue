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
            <div v-if="errors.length > 0">
                <ul>
                    <li v-for="(msg, index) in errors" :key="index">{{ msg }}</li>
                </ul>
            </div>
            <div v-else>Some required fields are missing. Please ensure that the study details include a title.</div>
        </p>
    </div>

</template>

<script setup>
const props = defineProps({
    errors: Array
});

const emit = defineEmits(['exit']);

const exit = () => {
    emit('exit');
}

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