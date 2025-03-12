<template>
    <button class="study__new" @click="createNewStudy()">
        <span class="font-normal font-semi">New study</span>
        <svg class="study__plus" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="url(#paint0_linear_172_144)" />
            <path
                d="M16.3556 24.8889C16.0102 24.8889 15.7209 24.7719 15.4876 24.5378C15.2536 24.3046 15.1366 24.0153 15.1366 23.6699V17.5746H9.04131C8.69592 17.5746 8.40619 17.4576 8.17213 17.2236C7.93889 16.9903 7.82227 16.701 7.82227 16.3556C7.82227 16.0102 7.93889 15.7205 8.17213 15.4864C8.40619 15.2532 8.69592 15.1366 9.04131 15.1366H15.1366V9.04131C15.1366 8.69592 15.2536 8.40619 15.4876 8.17213C15.7209 7.93889 16.0102 7.82227 16.3556 7.82227C16.701 7.82227 16.9907 7.93889 17.2248 8.17213C17.458 8.40619 17.5746 8.69592 17.5746 9.04131V15.1366H23.6699C24.0153 15.1366 24.3046 15.2532 24.5378 15.4864C24.7719 15.7205 24.8889 16.0102 24.8889 16.3556C24.8889 16.701 24.7719 16.9903 24.5378 17.2236C24.3046 17.4576 24.0153 17.5746 23.6699 17.5746H17.5746V23.6699C17.5746 24.0153 17.458 24.3046 17.2248 24.5378C16.9907 24.7719 16.701 24.8889 16.3556 24.8889Z"
                fill="white" />
            <defs>
                <linearGradient id="paint0_linear_172_144" x1="16" y1="0" x2="16" y2="32"
                    gradientUnits="userSpaceOnUse">
                    <stop stop-color="#4C68F0" />
                    <stop offset="0.91" stop-color="#54C0D1" />
                </linearGradient>
            </defs>
        </svg>
    </button>
</template>

<script setup>
import { user } from '~/public/script/reactive';

const emit = defineEmits(['newStudy'])
const router = useRouter();

const createNewStudy = async () => {
    //creating random id for study
    const studyId = crypto.randomUUID();

    emit('newStudy', studyId);

    // create study with a POST request with a empty body
    /*const response = await fetch('/api/study', {
        method: 'POST',
        body: JSON.stringify({
            'userId': user.info._id
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

  const result = await response.json();

    // redirect without reloading to the newly created study page using the study id
    if (result.created) {
        const studyId = result.studyId;
        await router.push(`/study/${studyId}/edit`);
    } else {
        console.log('Failed to create study');
    }*/
}
</script>

<style scoped>
    @import url('public/style/components/dashboard/_dashboard-sidebar.scss');
</style>