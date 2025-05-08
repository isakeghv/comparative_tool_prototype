# API
This document will describe the different endpoints of our API, what they are intended to do, and their HTTP methods. All endpoints are defined in the `server\api` folder.

PS: I should response status codes too omg

## `\auth`
The `\auth` endpoint is used to check if the user is authorized. It checks if the user has the JWT token in the cookies, and decodes the token in a `try-catch` block using `jwt.verify()` to make sure the token hasn't been tampered with.

| HTTP Method |    Body    |  Functionality  |
| ----------- | ---------- | --------------- |
| POST | ... | Check if user is authorized. |


## `\register`
The `\register` endpoint is fetched by the `registerForm` component. A new account can be created by filling the form with fields for 'first name', 'last name', 'email' and 'password'. When the user clicks on the form button, the component will send a ` POST` request to the endpoint.

It will then call to the database, and first check for a matching email in the `userCredentail` collection. If one is found, an account with tha email already exist, and the endpoint will return `{ created: false }`. If it the email is new, `firstName` and `lastName` will be stored in the `userProfile` collection, and `email`, `password` and a ref to the `userProfile` using it's `_id` field will be stored in the `userCredential` collection. This is a security measure to ...


| HTTP Method |    Body    |  Functionality  |
| ----------- | ---------- | --------------- |
| POST | firstname, lastname, email, password | Create a user. |


## `\login`
The `\login` endpoint is fetched by the `loginForm` component. It sends the inputs values of the 'email' and 'password' fields to the backend, checks if the 'email' is in the system, and if the corresponding password is the same as the hashed one using `bcrypt.compare()` if an existing email is found. If both are correct, the user will be signed in with a JWT token, which is stored in cookies using HTTP. If there's a server error, return status: `500`. 

| HTTP Method |    Body    |  Functionality  |
| ----------- | ---------- | --------------- |
| POST | email, password | Login a user. |

## `\users`
The `\users` endpoint checks first if the user is authorized to see the `\dashboard` page with the authorization of the JWT token, and find the first `userCredentail` entry that matches the `userId` in the `_id` field. If it successfully finds a user, it will find the corresponding `userProfile` id, and find all the studies associated with that id to populate the dashboard.

The endpoint is fetched by the `dashboard` page as a `GET` request. If the data has been successfully fetched, populate the reactive variable `user` with the `UserProfile` data, and the studies associated with the specific user. Additionally, store the first name in the `displayName` variable so it can be used to be set in the header.

| HTTP Method |    Body    |  Functionality  |
| ----------- | ---------- | --------------- |
| GET | N/A | Get user-relevant data to populate dashboard. |

## `\study`
The `\study` endpoint deals with all the CRUD operations of a study.
| HTTP Method |    Body    |  Functionality  |
| ----------- | ---------- | --------------- |
| GET | N/A | Get study with its current data. |
| POST | id, user, studyData | Create a study with relevant study data, and associate with the correct user. |
| PUT | id, studyData | Update a study with relevant study data by its id. |
| DELETE | id | ... |   