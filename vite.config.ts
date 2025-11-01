import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,  // يجبر Vite يراقب الملفات
    },
    port: 5173, // اختياري، ممكن تغيري رقم البورت
  },
})
