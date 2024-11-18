import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
import dotenv from 'dotenv'
import * as fs from 'fs';

// https://vitejs.dev/config/


export default defineConfig(({ mode }) => {

  dotenv.config()
  const env = process.env

  return {
    plugins: [react({tsDecorators: true})],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    define: {
      global: {
        API_HOST: env.API_HOST || 'https://localhost',
        API_PORT: Number(env.API_PORT) || 3000,
      }
    },
    server: {
      host: '0.0.0.0', // Слушать на всех доступных IP
      port: Number(env.PORT) || 80, // Порт, на котором будет запущен сервер
      https: {
        key: fs.readFileSync('../ssl/server.key'),
        cert: fs.readFileSync('../ssl/server.cert'),
      },
    },
  }
})
