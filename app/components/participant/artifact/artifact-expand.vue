<template>
    <button class="overlay" v-if="source && filePath" @click="exit()" aria-label="exit window"></button>
    <div class="expand" v-if="source && filePath">
        <button class="expand__button" @click="exit()">Exit</button>
        <img :src="filePath" :alt="id" class="expand__img" v-if="isImage(source)">
        <embed :src="filePath" class="expand__embed" v-if="isPdf(source)">
        <audio class="expand__audio" v-if="isAudioFile(source) && filePath !== ''" controls>
            <source :src="filePath" type="audio/mpeg">
        </audio>
        <video :src="filePath" controls class="expand__img" v-if="isVideoFile(source)"></video>
    </div>

</template>

<script setup>
import { isImage, isPdf, isAudioFile, isVideoFile } from '#imports';

const props = defineProps({
    source: String,
    id: String,
})

const filePath = ref('');

const emit = defineEmits(['exit']);

const exit = () => {
    filePath.value = '';
    emit('exit')
};


const getFile = async () => {
    if (!props.source) return console.log('Missing source');
    const request = await fetch(`/api/serve-file?filename=${encodeURIComponent(props.source)}`);

    if (!request.ok) return null;

    const raw = await request.blob();

    return URL.createObjectURL(raw);
}

const setFile = async() =>{
    const fileurl = await getFile();

            if (!fileurl) filePath.value = '';

            filePath.value = `${fileurl}`;
}

watch(
    () => props.source,
    (source) => {
        if (source) setFile();
    }
)


</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
</style>