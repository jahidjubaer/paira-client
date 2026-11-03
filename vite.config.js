import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // vendor (React, router, axios) is ~365 kB, app code ~185 kB; other pages load their own code when opened (routes/router.jsx)
    chunkSizeWarningLimit: 400,
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Libraries change rarely, so returning visitors keep them cached across site updates
          groups: [{ name: 'vendor', test: /node_modules[\\/](react|react-dom|react-router|scheduler|axios)[\\/]/ }],
        },
      },
    },
  },
})
