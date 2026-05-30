import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'midtrans-api',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (req.url === '/api/midtrans-token' && req.method === 'POST') {
              let body = '';
              req.on('data', chunk => {
                body += chunk;
              });
              req.on('end', async () => {
                try {
                  const payload = JSON.parse(body);
                  const serverKey = env.MIDTRANS_SERVER_KEY || process.env.MIDTRANS_SERVER_KEY;
                  if (!serverKey || serverKey.includes('PLACEHOLDER')) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                      error: 'MIDTRANS_SERVER_KEY is not configured. Please set your actual Midtrans Sandbox Server Key in .env.local.' 
                    }));
                    return;
                  }
                  
                  const authHeader = 'Basic ' + Buffer.from(serverKey + ':').toString('base64');
                  
                  // Sandbox keys from dashboard start with "Mid-server-" (not "SB-")
                  // Only treat as production if it looks like a production key
                  const isProduction = serverKey.startsWith('Mid-server-') && !serverKey.startsWith('SB-Mid-server-') ? false : !serverKey.startsWith('SB-');
                  const midtransApiUrl = 'https://app.sandbox.midtrans.com/snap/v1/transactions';
                  
                  const midtransRes = await fetch(midtransApiUrl, {
                    method: 'POST',
                    headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': authHeader
                    },
                    body: JSON.stringify({
                      transaction_details: {
                        order_id: 'GG-' + Math.round(Math.random() * 10000000) + '-' + Date.now(),
                        gross_amount: Math.round(payload.amount || 3800000),
                        currency: 'IDR'
                      },
                      credit_card: {
                        secure: true
                      },
                      customer_details: {
                        first_name: payload.firstName || 'John',
                        last_name: payload.lastName || 'Builder',
                        email: payload.email || 'john@ggstore.com',
                        phone: payload.phone || '+628110000000'
                      }
                    })
                  });
                  
                  const midtransData = await midtransRes.json();
                  res.writeHead(midtransRes.status, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify(midtransData));
                } catch (err: any) {
                  res.writeHead(500, { 'Content-Type': 'application/json' });
                  res.end(JSON.stringify({ error: err.message }));
                }
              });
            } else {
              next();
            }
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
