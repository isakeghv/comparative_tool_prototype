<template>
    <div class="slide__cont--one">
        <div class="aside__container aside__container--exports no-border">
            <button @click="$emit('toggle')" class="slide__btn" data-tooltip="Show sidebar" aria-label="Show sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" class="slide__svg">
                    <path
                        d="M460-320v-320L300-480l160 160ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z" />
                </svg>
            </button>
        </div>
        <div v-if="isDisabled" class="exports__cont no-border">
            <div class="exports__options">
                <a href="#" @click="downloadJson()">Export JSON</a>
                <a href="#" @click="exportData()">Export CSV</a>
            </div>
        </div>
    </div>
</template>

<script setup>
import { showResponses, responses, study } from '~/public/script/reactive';
const isDisabled = inject('disabled');
const props = defineProps({
});

const emit = defineEmits(['toggle']);

const downloadJson = () => {
    if (!responses.value) return console.error('No data to download')
    const filename = `${study.title} - responses.json`;

    const blob = new Blob([JSON.stringify(responses.value, null, 2)], { type: 'application/json' })
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = `${filename}`;
    anchor.click();
}

const exportData = (downloadMethod) => {
    console.log('am exporting to mars!!!')
}
</script>

<style scoped>
@import url('public/style/components/study/study-aside.scss');
</style>
