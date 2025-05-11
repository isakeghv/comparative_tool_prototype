<template>
    <div class="demographic demographic__container">
        <div style="display: flex; gap: 0.8rem; justify-content: space-between;">
            <div>
                <h2 class="demographic__headline font-h5 font-semi">Study data</h2>
                <div class="demographic__main">
                    <!-- the <br> is temporarily here... was lazy-->
                    <span>Study start</span><br>
                    <span>Study end</span><br>
                    <span>Last modfied</span><br>
                    <span>Total</span><br>
                    <span>Partial</span><br>
                    <span>Completed</span><br>
                    <span>Desired</span><br>
                    <span>Submission rate</span><br>
                    <span>Completion time</span><br>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const studyResponses = inject('studyResponses');

</script>

<style scoped>
    @import url('public/style/components/study/study-main.scss');
    @import url('public/style/components/demographics/demographics.scss');
</style>