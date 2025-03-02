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
N/A

### Functionalities
1. Allow researcher to log into their account using their email and password
2. After the form is submitted, log in users who's account is verified

### Emits

#### toggle to signup form
Event: toggle
payload: none
Data-type: -

Used to toggle to "sign-up"/register form is displayed instead of login-form

### Usage
Include in page file with `<LoginForm/>`.


### Styling
Styling should be done in:
File: `login.scss`
Relative: `public/style/components/login/login.scss`

```
<style scoped>
    @import url('public/style/components/login/login.css');
</style>
```

## registerForm (component)
A register form for users to create an account. If they alread have an account, they can follow the hyperlink at the bottom of the form that sends them to the login form with the `loginForm` component.  

### Props
N/A

### Functionalities
1. Allow researcher to create an account using a name, a unique email, and a strong password. 
2. After the form is submitted, create an account that the researcher can log in with.

### Emits

#### toggle to sign-in form
Event: toggle
payload: none
Data-type: -

Used to toggle the "sign-in" form instead of register form

#### Created user success
Event: userCreated
payload: status, message
Data-type: Boolean, String

Use to either redirect user to their new user-dashboard, or present prompt that email has already been used

### Usage
Include in page file with `<RegisterForm/>`.


### Styling
Styling should be done in:
File: `login.scss`
Relative: `public/style/components/login/login.scss`

```
<style scoped>
    @import url('public/style/components/login/login.css');
</style>
```