<template>
    <div class="details__container">
        <div class="details__main">
            <label for="details__title_input" class="details__label hide">Title</label>
            <input type="text" id="details__title_input" class="details__input font-h4 font-medium" placeholder="Title"
                v-model="titleModel" :disabled=isDisabled maxlength="50" required>
            <label for="details__textarea" class="details__label font-h6 font-medium">Description</label>
            <textarea id="details__textarea" class="details__textarea font-normal" v-model="descrModel"
                :disabled=isDisabled maxlength="3000"></textarea>

            <div class="details__upload">
                <p class="details__paragraph font-h6 font-medium">Thumbnail</p>
                <p class="details__info font-normal">Use an uploaded artifact as a thumbnail for you study.</p>
            </div>
            <div class="details__section">
                <div class="details__thumbnail" v-for="(artifact, i) in allArtifacts">
                    <input type="radio" name="thumbnail_select_radio" :id="`thumbnail_${i}_radio`" class="details__radio"
                        @click.prevent="setThumbnail(artifact.source)"
                        :checked="study.thumbnail === artifact.source">
                    <label :for="`thumbnail_${i}_radio`" class="details__checkbox" aria-label="Select"></label>
                    <ArtifactMedia :artifact="artifact" />
                </div>
            </div>
        </div>
    </div>
    <DetailsAside />
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const titleModel = computed({
    get: () => study.title,
    set: (val) => study.title = val
});

const descrModel = computed({
    get: () => study.description,
    set: (val) => study.description = val
});

const allArtifacts = computed(() => {
    const artifacts = study.questions.flatMap(q => q.artifacts.filter(a => {
        //only returning artifacts that are image files
        const extension = a.source.split('.')[1];
        return ['png', 'jpg', 'jpeg', 'svg'].includes(extension)
    }));

    return artifacts;
})

const emit = defineEmits(['validate']);

//initiating content, so title and description has correct content when component is opened
const initiateContent = () => {
    if (study.title) titleModel.value = study.title;
    if (study.description) descrModel.value = study.description;
}

const setThumbnail = async (artifact) => {
    const request = await fetch('/api/thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            artifact,
            studyID: study.id
        }),

        credentials: 'include'
    })

    if (!request.ok) {
        if (!study.thumbnail) study.thumbnail = '';
        return console.error('Could not set thumbnail')
    };

    const response = await request.json();

    if (response.success) {
        study.thumbnail = artifact;
    } else if (!response.success && !study.thumbnail) {
        study.thumbnail = '';
    }
}

//calling function when component is displayed
initiateContent();
</script>

<style scoped>
@import url('public/style/components/details/details.scss');
</style>