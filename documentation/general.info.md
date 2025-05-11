# General

This folder contains documentation and information regarding

- Preparation before building components.
- Component props
- Component functionalities
- Emits (if relevant)
- How to use components
- Styling
- General (if relevant)
- Other-headlines (if relevant)

## IMPORTANT

Each branch should have its own .md file to avoid merge conficts and losing documentation.
How components should be made, logic etc should be planned and written in .md file before creating the component.
Any changes deviating from what is planned should be documented and updated in .md file.

All styling, unless global, should be "scoped":
"<style scoped></style>"

## Required

Each .md file is required to have headlines for props, functionalitites, usage, styling (stating where the component is styled).

Headline for "General" should only be used if there is relevant information to include that is actually relevant.

Headline for "Other-headlines" should only be done if there is relevant information to include that is actually relevant and not general.

Headline for "Emits" should only be included if component is emitting an event.
"Emits" should include the custom-event name, for example "update", "clicked" etc, as well what the payload:

- is
- datatype (if relevant)
- Any relevant information regarding why/purpose etc if relevant/not intuitive

Structure:
"

### Emits

#### "Action1"

Event: name-Of-Event
Payload: What the payload should be
Data-type Data-type-of-payload

Small explanation if relevant.

#### "Action2"

Event: other-Name-Of-Event
Payload: What the payload should be
Data-type Data-type-of-payload

Small explanation if relevant.

"

## File structure:

(Please use the below structure as blueprint when writing. E.g. copy/paste and modify)
"

## "componentName" component

"general information here"

### props

"list of props that should be passed to component"

### Functionalities

"list and explanation of functionalitites in component"

### Emits

"List of emits in the correct format described above"

### Usage

"explanation for component usage, including a code-snippet of how to include component in other file"

### Styling

"Explaining where styling should be done, as well as file-name and path if relevant"

### General

General information if relevant to add

### Other-headline

Other headline with information if relevant, and specific to something (NOT general).

(use below to separate component-information):

---

---

---

---

"
