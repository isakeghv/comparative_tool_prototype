<template>
    <form @submit.prevent="newStudy">
        <label for="title">Title</label><br>
        <input type="text" name="title" v-model="title" id="title"
        placeholder="Title" required>
        <input type="submit" value="Save">
    </form>

    <NuxtLink to="/dashboard">Go back</NuxtLink>
</template>

<script setup>
import { user } from '~/public/script/reactive';
// import { useRoute } from 'vue-router'

const route = useRoute()
const studyId = route.params.studyId 

const title = ref('');

// create a empty study when user click on the 'New study' button
const newStudy = async () => {
    const response = await fetch('/api/study', {
        method: 'PUT',
        body: JSON.stringify({
            userId: user.info._id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}
</script>

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>