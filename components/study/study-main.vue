<template>
    <h1>Replace this content!</h1>
    <p>This is the main area for where the question itself is made/edited etc</p>

    {{ config }}

</template>

<script setup>
import { study } from '~/public/script/reactive';
const props = defineProps({
    index: Number,
    id: String,
})

/*
------------------
******************
------------------

NOTE!

In this component we need to be able to give the following options:
- Modify/write question question.
- upload artifact and give it a unique name (so multiple files do not have the same name), 
    but it should extract the initial file-name and first and place as "identifier" for the artifact (can be modifier later)
- set/change identifier name of artifact.
- Decide if question is required or not before moving to next question/submitting
- Selecting what type of response (multiple choise, drag and drop etc).
- Set response options (for multiple choise and drag-and drop)
- set minimum and max values for "range" option in "response-format"
- set closing-method (date, duration, replies)
- set the closing-limit


------------------
******************
------------------




*/

//iterating array if id does not correspond with id of study located by index
const iterateArr = (id)=>{
    for (let i = 0; i < study.questions.length; i++){
        if (study.questions[i].id === id) return study.questions[i]
    }
    //returning null if not found
    return null
}

//returns the config of the question
const config = computed(()=>{
    let question = study.questions[props.index]

    //returning question if found
    if (question.id === props.id) return question
    
    //returning question (or null if question cannot be found at all, 
    // neither with index nor id), if the one located with index is incorrect
    return iterateArr(props.id)

})

</script>

<style scoped>

</style>