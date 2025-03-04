// https://nuxt.com/docs/guide/directory-structure/middleware
// setting up guards so if a user doesn't have proper authentication, redirect the user, and vice versa

// use this in script setup to use middleware
// definePageMeta({
// 	middleware: 'auth'
// }); 

export default defineNuxtRouteMiddleware((to, from) => {
	// get stored token from localStorage
	const token = localStorage.getItem('token');

	// // redirect user back if not authenticated by a JWT token and trying to enter the login endpoint
	// // hmmm but we don't have visble endpoints for this... brb
	if (!token && to.path !== '/login') {
		return navigateTo('/login');
	}

	// redirect to home (which would be dashboard now?) if already authenticated
	if (token && to.path === '/login') {
		return navigateTo('/');
	}
});