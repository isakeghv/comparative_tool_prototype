<template>
    <div class="demographic demographic__container">
        <div class="details__main">
            <h2 class="demographic__headline font-h5 font-semi">Privacy policy, terms and conditions</h2>
            <div class="demographic__row">
                <label for="terms__request_checkbox" class="demographic__label">
                    <span class="demographic__span font-normal">Include custom policy/terms</span>
                    <span class="demographic__slider"
                        :class="{ 'demographic__slider--active': study.customTerms.terms }">
                        <span class="demographic__thumbnail"
                            :class="{ 'demographic__thumbnail--active': study.customTerms.terms }"></span>
                    </span>
                </label>
                <input type="checkbox" v-model="study.customTerms.request" id="terms__request_checkbox"
                    class="demographic__checkbox">
            </div>
            <label for="terms__textarea" class="details__label font-h6 font-medium" v-if="study.customTerms.request">Privacy policy, terms and conditions:</label>
            <textarea id="terms__textarea" class="details__textarea font-normal" v-model="study.customTerms.terms"v-if="study.customTerms.request">
        </textarea>
        </div>
    </div>
</template>

<script setup>
import { study } from '~/public/script/reactive';

</script>

<style scoped>
@import url('public/style/components/demographics/demographics.scss');
@import url('public/style/components/details/details.scss');
</style>