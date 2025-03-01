# Documentation and guidelines

## studyBlock component

The study-block component is the component displayed in the dashboard for each of the studies.

### Props

- title
- startDate
- id
- status

### Functionalities

1. The whole component should be clickable.
2. When clicking the component, the page for that specific study should show up
3. The specific study should show up when clicking, identifying it with prop "id"
4. When clicking the three dots, a pop-up menu should appear with the options to:
   - View responses
   - Edit study
   - Delete study - which should prompt a "are you sure box" (component: studyDelete.vue)
   - Duplicate study (create new study-id for duplicated study)
   - Export JSON
   - Export CSV
5. Should emit an event for study to delete. Study-id should be event-payload.

### Emits

#### Selecting a study

Event: select
Payload: study-id
Data-type: String

To be used in order to select and display a study from the dash-board page

#### Deleting a study

Event: delete
Payload: study-id
Data-type: String

#### Edit a study

Event: edit
Payload: study-id
Data-type: String

#### Duplicate a study

Event: duplicate
Payload: study-id
Data-type: String

#### Export a study

Event: export
Payload: study-id, file-format
Data-type: String

Used to locate study to delete, and trigger the "are you sure" deletion-component.

### Usage

To use component, include (below) in the page file. It should be used in the dashboard-page
<StudyBlock title="title-of-study" startDate="start-date-of-study" id="id-of-study"/>

### Styling

Styling should be done in:
File: studyBlock.scss.
Relative: "public/style/components/studyBlock/studyBlock.scss".

Link "StudyBlock" component to .vue the css file with:

<style scoped>
    @import url('/style/components/studyBlock/studyBlock.css');
</style>

---

---

---

---

## DeleteStudy component

"general information here"

### props

- id

### Functionalities

1. The component should only appear when an study (id) is selected for deletion.
2. Delete study if researcher confirms
   - Delete study based on study-id
3. Not delete study if researcher cancels
4. Should emit event to reset the id prop to null if "cancel" is selected

### Emits

#### Cancel deletion

Event: CancelDelete
Payload: null
Data-type: null

Cancel deletion, and reset parameter (study-id) being sent as prop to "studyDelete" component

### Usage

To use component, include (below) in the page file. It should be used in the dashboard-page
<StudyDelete id="deleteId"/>

"deleteId" should be a variable in dashboard file:
const deleteId = ref(null)

(more information at "### deleteId")

### Styling

Styling should be done in:
File: studyDelete.scss.
Relative: "public/style/components/studyDelete/studyDelete.scss".

Link "StudyDelete" component .vue file to the css file by using:

<style scoped>
    @import url('/style/components/studyDelete/studyDelete.scss');
</style>

### deleteId

Should be null at default
Should be updated to hold an id when a study is selected for deletion in "studyBlock" component (event: deleteStudy)
Should be passed as a prop to "StudyDelete".
Should be reset to "null" if "StudyDelete" emits "CancelDelete"

### General

1. Should only appear if "id" has value
1. Should ask "if the user/researcher is sure they want to delete the study".
1. Should present the name of the study when asking user/researcher.
1. Component should hold the logic to delete the study.
   - Should delete study only if confirmed
