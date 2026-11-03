import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// One id per build: written into the app (import.meta.env.VITE_BUILD_ID) and into /version.json,
// so an open tab can see a newer version was deployed (UpdateNotice)
const BUILD_ID = Date.now().toString(36)

// Emits /version.json and gives public/sw.js a new cache name, so old cached files are dropped after a deploy
const buildStamp = () => ({
  name: 'build-stamp',
  apply: 'build',
  generateBundle() {
    this.emitFile({ type: 'asset', fileName: 'version.json', source: JSON.stringify({ build: BUILD_ID }) })
  },
  writeBundle(options) {
    const file = resolve(options.dir, 'sw.js')
    writeFileSync(file, readFileSync(file, 'utf8').replace("const VERSION = 'paira-v1'", `const VERSION = 'paira-${BUILD_ID}'`))
  },
})

export default defineConfig({
  plugins: [react(), tailwindcss(), buildStamp()],
  define: { 'import.meta.env.VITE_BUILD_ID': JSON.stringify(BUILD_ID) },
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
