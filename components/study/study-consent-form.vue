

<template>
    <div class="demographic demographic__container">
        <div class="details__main">
            <h2 class="demographic__headline font-h5 font-semi">Consent form</h2>
            <div class="demographic__row">
                <span class="demographic__span font-normal">Include a custom consent form</span>
                <label for="terms__request_checkbox" class="demographic__slider" id="terms__request">
                    <input type="checkbox" v-model="requestModel" id="terms__request_checkbox" class="demographic__checkbox" @change="updateRequest()" :disabled=isDisabled>
                    <span class="demographic__thumbnail" :class="{'demographic__thumbnail--active': requestModel}"></span>
                </label>
            </div>
            <label v-if="study.customTerms.request" for="terms__textarea" class="details__label font-h6 font-medium hide">Terms of Service and Privacy Policy: </label>
            <textarea v-if="study.customTerms.request" id="terms__textarea" class="details__textarea font-normal" v-model="study.customTerms.terms" :disabled=isDisabled>
            </textarea>
        </div>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';
const isDisabled = inject('disabled');

const requestModel = ref(study.customTerms.request);

const updateRequest = () => {
    study.customTerms.request = requestModel.value
}

</script>

<style scoped>
@import url('public/style/components/demographics/demographics.scss');
@import url('public/style/components/details/details.scss');
</style>