import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, Plugin } from 'vite';
import { evaluateSpeechWithGemini, generateInterlocutorReply } from './src/server/aiCoach.ts';

dotenv.config();

function apiPlugin(): Plugin {
  return {
    name: 'skillup-ai-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        if (req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const data = body ? JSON.parse(body) : {};
              if (url === '/api/evaluate') {
                const result = await evaluateSpeechWithGemini(data);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
                return;
              }

              if (url === '/api/reply') {
                const result = await generateInterlocutorReply(data);
                res.statusCode = 200;
                res.end(JSON.stringify(result));
                return;
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ error: 'Endpoint not found' }));
            } catch (err: any) {
              console.error('API Error:', err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err?.message || 'Internal Server Error' }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

