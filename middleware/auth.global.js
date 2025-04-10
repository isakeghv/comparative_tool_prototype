// https://nuxt.com/docs/guide/directory-structure/middleware
// setting up guards so if a user doesn't have proper authentication, redirect the user, and vice versa

// use this in script setup to use middleware
// definePageMeta({
// 	middleware: 'auth'
// });

export default defineNuxtRouteMiddleware(async (to) => {

	//getting token/cookie
	const { data } = await useFetch('/api/auth', {
		credentials: 'include',
	  });

	  //redirecting to login-page if cookie/token is not present or to page for participants if requested
	  if (data.value?.error && to.path !== "/" && !to.path.startsWith("/studies/")) return navigateTo("/");
	
	  // redirect to to dashboard if token exists: if already authenticated
	  if (!data.value?.error && to.path === "/") return navigateTo("/dashboard");
});
