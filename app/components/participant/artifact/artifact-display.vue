<template>
    <div :class="{'artifact__container--fixed': dragging}" class="artifact__container artifact__borderless"
        ref="artifactRef" @dragstart="dragStart($event, artifact)" :draggable="draggable">
        <ArtifactMedia :artifact="artifact"  />
        <div class="wrapper wrapper--zero">
            <ExpandButton @expand="selectMedia(artifact.source, artifact.id)" />
        </div>
    </div>

</template>

<script setup>
import ExpandButton from './artifact-expand-button.vue';
import ArtifactMedia from './artifact-media.vue';

const props = defineProps({
    artifact: Object,
    responseType: String,
});

const artifactRef = ref('')
const dragging = ref(false)
const emittedMove = ref(false);

const draggable = computed(() => {
    return props.responseType === 'linear' || props.responseType === 'drop'
})

const getFile = async (source) => {
    const request = await fetch(`/api/serve-file?filename=${encodeURIComponent(source)}`);

    if (!request.ok) return null;

    const raw = await request.blob();

    return URL.createObjectURL(raw);
}


const emit = defineEmits(['selectMedia', 'moving', 'dropped']);

const selectMedia = (source, id) => {
    emit('selectMedia', source, id);
};

const file = ref('');


// set artifact id and source, allow it to move, and emit to parent which artifact was moved
const dragStart = (e, artifact) => {

    dragging.value = true;

    const element = artifactRef.value;

    const move = async (event) =>{
        element.style.setProperty('--x-pos', `${event.pageX - (144 / 2)}px`)
        element.style.setProperty('--y-pos', `${event.pageY - (147.4 / 2)}px`)

        if (!file.value) file.value = await getFile(props.artifact.source)

        if (!emittedMove.value){
            emittedMove.value = true;
            emit('moving', {id: props.artifact.id, source: props.artifact.source, file: file.value})
        }
    }

    const stop = () =>{
        dragging.value = false;

        document.removeEventListener('mousemove', move);
		document.removeEventListener('mouseup', stop);

        emit('dropped')

        if (emittedMove.value) emittedMove.value = false;
    }

    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', stop);
};

</script>

<style scoped>
@import url('public/style/components/study/study-main.scss');
@import url('public/style/components/participant/participant-question.scss');
</style>
