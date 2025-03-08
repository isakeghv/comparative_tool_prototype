// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // https://nuxt.com/docs/guide/concepts/rendering
  ssr: false,
  runtimeConfig: {
    private: {
      mongoURI: process.env.MONGO_URI,
      secretJWT: process.env.SECRET_JWT
    }
  },
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  components: [
    { path: "~/components", pathPrefix: false },
    { path: "~/components/dashboard", pathPrefix: false },
    { path: "~/components/study", pathPrefix: false },
    { path: "~/components/study/demographic", pathPrefix: false },
    { path: "~/components/study/details", pathPrefix: false },
  ],
})
