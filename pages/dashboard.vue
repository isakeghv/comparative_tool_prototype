<template>
	<Dashboard-Header :name="displayName"/>
	<div class="container" v-if="showMain && !study.id">
		<Dashboard-main @newStudy="(id) => study.id = id"/>
	</div>
    <Study-editor v-if="study.id"/>

	<!--Display message if issues fetting user-info-->
	<div class="container" v-if="!showMain && !study.id">
		<h2 class="container__headline">Oh oh!</h2>
		<p class="container__paragraph">Issues retrieving information. Please try to reload</p>
        <button class="container__button">Reload</button>
        <span class="container__span">or</span>
        <button class="container__button">sign out</button>
	</div>

</template>

<script setup>
import { user } from '~/public/script/reactive';
import { study } from '~/public/script/reactive';

const showMain = ref(true);
const displayName = ref('')

const getUserInfo = async () => {
	try {
        //getting the user-information; include any cookies included in the request
        const { data, error } = await useFetch("/api/users", { credentials: "include" });

        if (error.value) {
            throw new Error(error.value);
        }

        //confirming that data was fetched
        if (data.value) {
            //inserting user-info into reactive variable
            user.info = data.value.userProfileData;

            //inserting studies into reactive variable (client-side only)
            user.studies = data.value.studies;

            //setting name to display into variable, to be passed to header-component
            displayName.value = user.info.firstName;
        } else {
            //setting to false in case information was not fetched, to display error message to user in UI
            showMain.value = false;
        }
    } catch (err) {
        console.error('Error fetching user info:', err);
        showMain.value = false;
    }
}

await getUserInfo();

</script>

<style scoped>
@import url('public/style/pages/dashboard/_dashboard.scss');
</style>