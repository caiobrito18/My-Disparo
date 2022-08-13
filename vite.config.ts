import { defineConfig,loadEnv } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'
// https://vitejs.dev/config/

dotenv.config()
export default defineConfig( {

  plugins: [react()],
  server:{
    port: 5000
}
})
