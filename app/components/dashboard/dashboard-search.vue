<template>
    <div class="study__filter study__filter--column font-normal">
        <label for="study_search_inp" class="search__label">
            Search
        </label>
        <span class="search__information" @mouseover="showInfo = true" @mouseleave="showInfo = false">
            i
        </span>
        <p class="search__paragraph font-normal" v-if="showInfo">
            Search to find a specific study. You can search by study title, description, status
            (draft, ongoing, completed), question and artifact ID.
        </p>
        <input type="search" name="" id="study_search_inp" class="search__input font-normal" v-model="inputmodel"
            @input="search()">
    </div>
</template>

<script setup>

const inputmodel = ref('')

// get the filter that is active current so it's possible to style it
const props = defineProps({
    activeFilter: String
});

const showInfo = ref(false);

const emit = defineEmits(['search'])

//Emits the filter to dashboard-main for which studies to display
const search = () => {
    emit('search', inputmodel.value);
}

</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-sidebar.scss');
</style>