<template>
    <button class="aside__button" @click="logout">
        Log out
    </button>
</template>

<script setup>

const logout = async () => {
    //calling api to remove cookie and log user out
    const { data } = await useFetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
    });

    //checking if cookie is deleted correctly. If true, reload, if false, use alternative solution..
    if (data.value?.success) {
        location.reload();
    } else {
        //alternative solution
        return alert('Unable to log out. Please destroy your computer instead');
    }

}
</script>

<style scoped>
@import url('public/style/components/aside/dashboard-main-aside.css');
</style>
