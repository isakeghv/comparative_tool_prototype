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
