<template>
  <RegisterForm/>
</template>

<script setup>
  const { data } = await useFetch('/api/users')
</script>
