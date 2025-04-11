import { ref } from "vue";
import { participantAnswer } from "~/public/script/participant";

// ref of artifacts dropped in drop zone
export const box_draggedArtifact = ref('');
export const box_draggingArtifact = ref(false);

//for when an artifact is being dragged
export const box_moving = (artifact) => {
    box_draggedArtifact.value = artifact
    box_draggingArtifact.value = true;
}

export const box_artifactIsOver = ref(false)

export const box_mouseover = () => {
    if (box_draggedArtifact.value) box_artifactIsOver.value = true
}

export const box_mouseleave = () => box_artifactIsOver.value = false

//for when an artifact is dropped
export const box_drop = (id, index, box) => {

    //returns if no artifact is being dragged: to avoid issues
    if (!box_draggingArtifact.value) return

    //setting to false so it will not be able to run function again without dragging a new artifact
    box_draggingArtifact.value = false;

    if (!participantAnswer[id]) participantAnswer[id] = {}

    const itemID = box_draggedArtifact.value.id;
    const itemSource = box_draggedArtifact.value.source;
    const boxLabel = box

    participantAnswer[id][index] = {
        id: itemID,
        // source: itemSource,
        label: boxLabel
    }

    //setting dragged artifacts back to null, as it should not be able to drag artifacts again
    box_draggedArtifact.value = null;
}