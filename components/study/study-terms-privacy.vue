<template>
    <div class="demographic demographic__container">
        <div class="details__main">
            <h2 class="demographic__headline font-h5 font-semi">Terms of Service and Privacy Policy</h2>
            <div class="demographic__row demographic__row--remove">
                <span class="demographic__span font-normal">Include custom policy/terms</span>
                <label for="terms__request_checkbox" class="demographic__slider">
                    <input type="checkbox" v-model="requestModel" id="terms__request_checkbox" class="demographic__checkbox" @change="updateRequest()">
                    <span class="demographic__thumbnail" :class="{'demographic__thumbnail--active': requestModel}"></span>
                </label>
            </div>
            <label for="terms__textarea" class="details__label font-h6 font-medium hide" v-if="study.customTerms.request">Terms of Service and Privacy Policy: </label>
            <textarea id="terms__textarea" class="details__textarea font-normal" v-model="study.customTerms.terms"v-if="study.customTerms.request">
        </textarea>
        </div>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const requestModel = ref(study.customTerms.request);

const updateRequest = () => {
    study.customTerms.request = requestModel.value
}

</script>

<style scoped>
@import url('public/style/components/demographics/demographics.scss');
@import url('public/style/components/details/details.scss');
</style>