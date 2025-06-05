import helper from "../utils/validationHelpers";
import { validate as isValidUUID } from "uuid";

const checkValidUUID = (input) => {
    return isValidUUID(input)
}


const validateArtifactDelete = (body) => {

    const bodyIsValidFormat = helper.checkType(body, 'object');
    if (!bodyIsValidFormat) throw new Error('Invalid format');

    const { artifacts, studyID } = body;

    const studyIdIsValid = helper.checkType(studyID, 'string') && helper.checkLength(studyID, 30, 45) && checkValidUUID(studyID);
    if (!studyIdIsValid) throw new Error('Invalid input');

    const artifactArrayIsValid = helper.checkType(artifacts, 'array') && helper.checkLength(artifacts, 1, 150);
    if (!artifactArrayIsValid) throw new Error('Invalid input');


    for (const artifact of artifacts) {
        const artifactIsValid = helper.checkType(artifact, 'string') && helper.checkLength(artifact, 40, 60);
        if (!artifactIsValid) throw new Error('Invalid input');

        console.log(artifact);
        console.log(artifact.split('/')[2]?.split('.')[0]);

        //filtering out only the file-name from the complete path in order to validate that it is proper
        const filename = artifact.split('/')[2]?.split('.')[0]?.trim();

        const FileNameIsValid = helper.checkType(filename, 'string') && helper.checkLength(filename, 30, 45) && checkValidUUID(filename);
        if (!FileNameIsValid) throw new Error('Invalid input');
    }

    return true;
}






const validator = {
    deleteArtifact: validateArtifactDelete,
    uuid: checkValidUUID
}

export default validator;