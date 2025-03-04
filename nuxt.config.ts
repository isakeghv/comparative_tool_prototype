// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    private: {
      mongoURI: process.env.MONGO_URI,
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: [
    { path: "~/components", pathPrefix: false },
  ],
})
