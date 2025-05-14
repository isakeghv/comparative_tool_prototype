<template>
    <div :class="{'artifact__container--fixed': dragging}" class="artifact__container artifact__borderless"
        ref="artifactRef" @dragstart="dragStart($event, artifact)" :draggable="draggable">
        <div class="wrapper wrapper--zero">
            <ExpandButton @expand="selectMedia(artifact.source, artifact.id)" />
        </div>
        <ArtifactMedia :artifact="artifact"  />
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


const emit = defineEmits(['selectMedia', 'moving', 'dropped']);

const selectMedia = (source, id) => {
    emit('selectMedia', source, id);
};


// set artifact id and source, allow it to move, and emit to parent which artifact was moved
const dragStart = (e, artifact) => {

    dragging.value = true;

    const element = artifactRef.value;

    const move = (event) =>{
        element.style.setProperty('--x-pos', `${event.pageX - (144 / 2)}px`)
        element.style.setProperty('--y-pos', `${event.pageY - (147.4 / 2)}px`)

        if (!emittedMove.value){
            emittedMove.value = true;
            emit('moving', {id: props.artifact.id, source: props.artifact.source})
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
