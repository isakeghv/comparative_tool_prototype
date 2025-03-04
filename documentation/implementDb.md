# Implementing the database

## General
This document will be regarding how to implement the database in a complete manner. The end result will be to find out how to use connect our web application to MongoDB and Mongoose with MongoDB Atlas (free tier), and structure the data that focuses on scalability and efficiency. However, first we will need to know how to structure the data for each user, and how each of them can access their stored data within the application.

## MongoDB
MongoDb uses indexing, making the search for a form made by user with *x* id much faster than a typical linear search. a

### User
Schema: `models/userCredential.js`

### Study
Schema: `models/study.js`

- Before updating any field (e.g. saving title, adding a question, or modifying a question), we need to find the document you want to modify. This is typically done using a unique id like the `_id` field in MongoDB. Once you've fetched the document, you can add or modify accordingly (is prob same for delete and read as well).
    - Example on methods to use: `save()`, `updateOne()`, or `findOneAndUpdate()`

- When you delete a question, you remove it from the array and save the updated survey document
- Mongoose will throw an validation error if you try to save a document with an invalid `responseType` (not included in `enum`) to a MongoDB document. Below the `responseType` field, there's a list of other fields. While they are optional for the Mongoose schema, some might be required for certain `responseType` enums.
    - [Drag and drop] `dropBox`: an array so you can add/remove a drop box as you need (**min**: 1, **max**: should be limited to a certain number)
    - [Range/Linear soring] `startLabel`/`endLabel`: labels are optional for both response types
    - [Checkbox/Range] `min`/`max`: a minimum and a maximum value is required for both response type

## JWT

## Production
When using MongoDB Atlas, make sure the production server's IP address is whitelisted in the MongoDB Atlas settings.

https://v2.nuxt.com/tutorials/moving-from-nuxtjs-dotenv-to-runtime-config/
https://mongoosejs.com/docs/validation.html

"transactions let you execute multiple operations and undo all the operations if one of them fails"
https://mongoosejs.com/docs/transactions.html

for api endpoints later idk
read/update/delete user
login/logout user
get participants, and their data

create/read/update/delete study
create/read/update/delete question