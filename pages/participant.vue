<template>
	<ParticipantHeader :start="start" />
</template>

<script setup>
// set to true when user clicks continue or sm
const start = ref(false);

// when clicked on start, create a participant session
function handleStart() {
    start.value = true;
}
</script>