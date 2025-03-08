<template>
    <button class="aside__button font-normal" @click="logout">
        Log out
    </button>
</template>

<script setup>
import { user } from "~/public/script/reactive";

const logout = async () => {
    //calling api to remove cookie and log user out
    const { data } = await useFetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    });

    //checking if cookie is deleted correctly. If true, reload, if false, use alternative solution..
    if (data.value?.success) {
        user.info = null;
        user.studies = null;
        location.reload();
    } else {
        user.info = null;
        user.studies = null;
        //alternative solution
        return alert('Unable to log out. Please destroy your computer instead');
    }

}
</script>

<style scoped>
    @import url('public/style/components/dashboard/dashboard-main-aside.scss');
</style>
