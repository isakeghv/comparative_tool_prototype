import helper from "../utils/validationHelpers";
import { validate as isValidUUID } from "uuid";
import validator from "validator";

const checkValidUUID = (input) => {
    return isValidUUID(input)
}


const validateArtifactDelete = (body) => {

    const bodyIsValidFormat = helper.checkType(body, 'object');
    if (!bodyIsValidFormat) return false

    const { artifacts, studyID } = body;

    const studyIdIsValid = helper.checkType(studyID, 'string') && helper.checkLength(studyID, 30, 45) && checkValidUUID(studyID);
    if (!studyIdIsValid) return false

    const artifactArrayIsValid = helper.checkType(artifacts, 'array') && helper.checkLength(artifacts, 1, 150);
    if (!artifactArrayIsValid) return false

    //looping over artifacts because artifacts is an array, so each artifact is checked
    for (const artifact of artifacts) {
        const artifactIsValid = helper.checkType(artifact, 'string') && helper.checkLength(artifact, 40, 60);
        if (!artifactIsValid) return false

        //filtering out only the file-name from the complete path in order to validate that it is proper
        const filename = artifact.split('/')[2]?.split('.')[0]?.trim();

        const FileNameIsValid = helper.checkType(filename, 'string') && helper.checkLength(filename, 30, 45) && checkValidUUID(filename);
        if (!FileNameIsValid) return false
    }

    return true;
}

const validateLogin = (body) =>{
    const {email, password, turnstileToken} = body;

    const emailIsValid = helper.checkType(email, 'string') && helper.checkLength(email, 5, 50) && validator.isEmail(email);
    const pwdIsValid = helper.checkType(password, 'string') && helper.checkLength(password, 8, 100);
    const tokenIsValid = helper.checkType(turnstileToken, 'string') && helper.checkLength(turnstileToken, 900, 1100);

    return emailIsValid && pwdIsValid && tokenIsValid

}
 





const validate = {
    deleteArtifact: validateArtifactDelete,
    uuid: checkValidUUID,
    login: validateLogin
}

export default validate;