# Dashboard

## Dashboard page

Dashboard is a page, not component. The file is called "index.vue" for now, but most likely will change into "dashboard.vue" later on when the login functionality is included

### props

No known props at this moment

### Functionalities

1. prompt the "delete study" box when requested
2. collect events from components, for example for selecting a study
   - get id
   - query to get study details
   - change page and send study-id as parameter to display correct study in new page

### Emits

no known emits atm

### Usage

Currently, included in "app.vue" with "<NuxtPage/>" as it is the "index" page. when changed into "dashboard.vue" it will be included the same, but using /dashboard path

### Styling

Styling should be done in:
File: dashboard.scss.
Relative: "public/style/pages/dashboard/dashboard.scss".

Link "dashboard" (index.vue for now) page to .vue the css file with:

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>

### NOTICE

THIS IS ONLY INDEX.VUE TEMPORARELY. IT WILL MOST LIKELY CHANGE INTO ITS OWN PAGE (DASHBOARD.VUE) WHEN LOGIN FUNCTIONALITY IS IMPLEMENTED

---

---

---

## Dashboard-header component
Header to use in dashboard and pages with the same layout/requirements, e.g. not login page and/or participant page(s)

### props
- name      (Name of Researcher)
- id        (id of study currently being reviewed)

### Functionalities
1. Display name of researcher when in
2. Include component which displays "save study", "publish study" etc and display when a study is being made/edited/etc
3. Pass "id" to component described in step 2 (above).

### Emits
no known emits atm

### Usage
include in page file with "<Dashboard-header/>"

To send props (name and id) do "<Dashboard-header id="id-placeholder" name="name-placeholder"/>"

### Styling
Styling should be done in:
File: dashboard-header.scss.
Relative: "public/style/components/header/dashboard-header.scss".

<style scoped>
    @import url('public/style/components/header/dashboard-header.css');
</style>

---

---

---

## Dashboard-main-aside component - NO LONGER ITS OWN COMPONENT - NOW A PART OF DASHBOARD-MAIN
Aside component to include in dashboard page. 

### props
None atm

### Functionalities
1. include reusable components for filtering studies (completed, all, ongoing, drafts), creating new study.
2. include component for "settings"
3. include component for logging out
4. collecting and forwarding events to dashboard

### Emits

#### Filter study

Event: filter
Payload: filter-query
Data-type: String

To be used in order to select and display a study from the dash-board page

#### Creating new study

Event: newStudy
Payload: id (temp-id: JSON.Stringify(Date.now()))
Data-type: Number

#### Open settings

Event: open
Payload: -
Data-type: -

#### Log out

Event: logOut
Payload: unknown atm
Data-type: unknown atm

### Usage
include in page file with "<Dashboard-main-aside/>"


### Styling
Styling should be done in:
File: dashboard-main-aside.scss.
Relative: "public/style/components/aside/dashboard-main-aside.scss".

<style scoped>
    @import url('public/style/components/aside/dashboard-main-aside.css');
</style>


---

---

---

## Dashboard-main component
Main area in the researcher dashboard where the study blocks are displayed

### props
- studies: Array

### Functionalities
1. include the study-blocks and pass information to study blocks
2. Collect event of study-block being opened/edit/delete etc and forward/continue emitting event for it
3. Loop over studies and use to create each study-block, which gets id, title and start-date as props

### Emits

#### Open study

Event: openStudy
Payload: study-id
Data-type: String

#### Delete study

Event: deleteStudy
Payload: study-id
Data-type: String

### Usage
include in page file with "<Dashboard-main studies="Array-place-holder"/>"


### Styling
Styling should be done in:
File: dashboard.scss.
Relative: "public/style/pages/dashboard/dashboard.scss".

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>

---

---

---

## Dashboard-newstudy component
button and logic for creating new study

### props
- none atm

### Functionalities
1. Emit event to create new study
2. Emit Date.now() as payload to use as temp-id

### Emits

#### New study

Event: newStudy
Payload: temp-study-id
Data-type: String

### Usage
include in page file with "<Dashboard-newstudy />"


### Styling
Styling should be done in:
File: dashboard.scss.
Relative: "public/style/pages/dashboard/dashboard.scss".

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>


---

---

---

## Dashboard-filter component
Buttons to use to toggle filter

### props
- filter        


### Functionalities
1. use to toggle which study-blocks to display - "completed", "ongoing", "drafts", "all"

### Emits

#### New study

Event: filter
Payload: filter-type : - "completed", "ongoing", "draft", "all"
Data-type: String

### Usage
include in page file with "<Dashboard-filter />"


### Styling
Styling should be done in:
File: dashboard.scss.
Relative: "public/style/pages/dashboard/dashboard.scss".

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>