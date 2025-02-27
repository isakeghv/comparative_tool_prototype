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