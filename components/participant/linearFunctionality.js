import { ref } from "vue";
import { participantAnswer } from "~/public/script/participant";

// ref of artifacts dropped in drop zone
export const linear_draggedArtifact = ref('');
export const linear_draggingArtifact = ref(false);
export const linear_droppedArtifacts = ref([]);
export const linear_insertAt = ref('');

//for when an artifact is being dragged
export const linear_moving = (artifact) => {
    linear_draggedArtifact.value = artifact
    linear_draggingArtifact.value = true;
}

export const linear_artifactIsOver = ref(false)

export const linear_artifactOver = () => {
    if (linear_draggedArtifact.value) linear_artifactIsOver.value = true
}

//changes the order of an artifact, so that it occurs earlier in the array
export const linear_orderUp = (id, index) => {
    //swaps the order of the items in the array
    [participantAnswer[id][index], participantAnswer[id][index - 1]] = [participantAnswer[id][index - 1], participantAnswer[id][index]]
}

//changes the order of an artifact, so that it occurs later in the array
export const linear_orderDown = (id, index) => {

    //return if out of bounds
    if (index >= participantAnswer[id].length - 1) return

    const thisItem = participantAnswer[id][index]
    const otherItem = participantAnswer[id][index + 1]

    //swaps the order of the items in the array. Should only occur if
    if (thisItem && otherItem) [participantAnswer[id][index + 1], participantAnswer[id][index]] = [thisItem, otherItem]
}

//for when an artifact is dropped
export const linear_drop = (id) => {

    //returns if no artifact is being dragged: to avoid issues
    if (!linear_draggingArtifact.value) return

    //setting to false so it will not be able to run function again without dragging a new artifact
    linear_draggingArtifact.value = false;

    //fixing so that it is an array if not already existing
    if (!participantAnswer[id]) participantAnswer[id] = [];

    //checking if artifact already exists in array
    const existingArtifact = participantAnswer[id].find(a => a.id === linear_draggedArtifact.value.id)

    //returns if artifact already exists in array of dropped artifacts
    if (existingArtifact) return

    //pushes to array of dropped artifacts, but only if the mouse if over the drop-area
    if (linear_artifactIsOver.value && linear_insertAt.value !== '') participantAnswer[id].splice(linear_insertAt.value, 0, linear_draggedArtifact.value);
    else participantAnswer[id].push(linear_draggedArtifact.value);

    //setting dragged artifacts back to null, as it should not be able to drag artifacts again
    linear_draggedArtifact.value = null;
}