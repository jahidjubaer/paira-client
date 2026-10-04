import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Main chunk is ~160 kB gzipped (React + router + bilingual page content)
  build: { chunkSizeWarningLimit: 600 },
})
