<template>
    <Dashboard-Header id="" name="Lefty"/>
    <div class="container">
        <Dashboard-main/>
    </div>
</template>

<script setup>
//Read documentation for this page at "dashboard.md" > documentation/dashboard.md
try {
	const fetchUserData = async () => {
		// get stored token from localStorage, and use it to authenticate a user agent with a server -> allows them to protected resources
		const token = localStorage.getItem('token');

		// return if nok token was found in localStorage
		if (!token) {
			return;
		}
        
        // jwt.verify(token, secretkey, [options, callback])
        
	  
		const response = await fetch(`/api/dashboard`, {
		  method: 'GET',
		  headers: {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json'
		  }
		});
	  
		const data = await response.json();
	  };
} catch (err) {

}
</script>

<style scoped>
    @import url('public/style/pages/dashboard/dashboard.css');
</style>