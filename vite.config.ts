import { viteCommonjs } from '@originjs/vite-plugin-commonjs';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import { defineConfig } from 'vite';
// https://vitejs.dev/config/

dotenv.config();
export default defineConfig({
  build: {
    target: ['es2015'],
    rollupOptions:{
      output:{
        format:"module",
        sourcemap:"inline"
      }
    }
  },
  plugins: [
    react({
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
    }),
    viteCommonjs()
  ],
  server: {
    port: 5000
  }
});
