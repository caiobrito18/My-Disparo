import { defineConfig,loadEnv } from 'vite'
import dotenv from 'dotenv'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
// https://vitejs.dev/config/

dotenv.config()
export default defineConfig({
  build:{
    target:["es2015"],
  },
  plugins: [react({
    babel: {
      plugins: [
        [
          'babel-plugin-styled-components',
          {
            displayName: true,
            fileName: false
          }
        ]
      ]
    }
  }),viteCommonjs(),],
  server:{
    port: 5000
}
})
