# API
This document will describe the different endpoints of our API, what they are intended to do, and their HTTP methods. All endpoints are defined in the `server\api` folder.

## `\auth`
The `\auth` endpoint is used to check if the user is authorized. It checks if the user has the JWT token in the cookies, and decodes the token in a `try-catch` block using `jwt.verify()` to make sure the token hasn't been tampered with.

| HTTP Method |    Name    |  Functionality  |
| ----------- | ---------- | --------------- |
| POST | default | Check if user is authorized. |

## `\login`
The `\login` endpoint is fetched

| HTTP Method |    Name    |  Functionality  |
| ----------- | ---------- | --------------- |
| POST | default | Check if user is authorized. |