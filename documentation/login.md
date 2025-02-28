# Login 

## Login page
The page will display one of two components: either `loginForm` or `registerForm`. The forms will be displayed on two separate routes (`/login` and `/register`) (tbh idk). The component is currently displayed in `index.vue` temporary when working on it, as it will be removed when merged.

### Emits
#### "user-logged-in (example)"
Event: user-logged-in
Payload: { 'userId': 1, 'username': "Lefty" }
Data-type: object

The data sent to the database server when user logs in successfully.

#### "other-actions"

## loginForm (component)
A login form for users to log into their account. If they don't have an account, they can follow the hyperlink at the bottom of the form that sends them to the register form with the `registerForm` component.  

### Props
    - email

### Functionalities
    1. Allow researcher to log into their account using their email and password
    2. After the form is sent, log in users who's account is verified

### Emits
    - working on it ty

### Usage
Include in page file with `<LoginForm/>`. To send its props (e-mail), do `<LoginForm email="some-email"/>`.


### Styling
Styling should be done in:
File: `loginForm.scss`
Relative: `public/style/components/loginForm/loginForm.scss`

```
<style scoped>
    @import url('public/style/components/loginForm/loginForm.css');
</style>
```

## registerForm (component)
