import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // This exposes your local IP
    port: 5173        // Default Vite port (can be changed if needed)
  }
})
