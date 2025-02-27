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
    @import url('/style/pages/dashboard/dashboard.css');
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
    @import url('/style/components/header/dashboard-header.css');
</style>