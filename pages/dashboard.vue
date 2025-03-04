<template>
    <Dashboard-Header :name="displayName"/>
    <div class="container" v-if="showMain">
        <Dashboard-main/>
		
    </div>
	<!--Display message if issues fetting user-info-->
	<div class="container" v-else>
		<h2 class="container__headline">Oh oh!</h2>
		<p class="container__paragraph">Issues retrieving information. Please try to reload</p>
    </div>
	
</template>

<script setup>
import { user } from '~/public/script/reactive';

const showMain = ref(true);
const displayName = ref('')

const getUserInfo = async () =>{
	//getting the user-information
	const { data, error } = await useFetch("/api/users", { credentials: "include" });

	//confirming that data was fetched
	if (data.value) {

		//inserting user-info into reactive variable
		user.info = data.value?.user;

		//inserting studies into reactive variable (client-side only)
		user.studies = data.value?.studies;

		//setting name to display into variable, to be passed to header-component
		displayName.value = user.info.firstName
	} else{
		//setting to false in case information was not fetched, to display error message to user in UI
		showMain.value = false
	}
}

await getUserInfo();

</script>

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>