import process from 'node:process'
import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  routeRules: {
    '/**': { cors: true, swr: 3600 },
  },
  runtimeConfig: {
    tmdb: {
      apiKey: process.env.TMDB_API_KEY || '',
      accessToken: process.env.TMDB_ACCESS_TOKEN || '',
    },
  },

  compatibilityDate: '2025-08-26',
})
