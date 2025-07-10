// Vector2Godot Vite Config - v1.1.6
import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // Important for Electron
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})
