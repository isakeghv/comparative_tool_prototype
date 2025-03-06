<template>
    <form @submit.prevent="">
        <label for="title">Title</label><br>
        <input type="text" name="title" v-model="title" id="title"
        placeholder="Title" required>
        <input type="submit" value="Save">
    </form>

    <NuxtLink to="/dashboard">Go back</NuxtLink>
</template>

<script setup>
    const title = ref('');
</script>