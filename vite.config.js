
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Log the API_KEY as seen by Vite during the build process
  // This log will appear in Vercel's build logs
  console.log(`[vite.config.js] Build command: ${command}, Mode: ${mode}`);
  
  // LEER DESDE CLAVE_API (o el nombre que Vercel te obligue a usar)
  const apiKeyFromVercelEnv = process.env.CLAVE_API; 
  console.log(`[vite.config.js] Value from Vercel's CLAVE_API environment variable: "${apiKeyFromVercelEnv}"`);

  if (command === 'build' && !apiKeyFromVercelEnv) {
    console.warn(
      '[vite.config.js] WARNING: CLAVE_API (or the name Vercel uses) is not defined or empty in the build environment! The application will likely fail to connect to the Gemini API. Ensure CLAVE_API is set in Vercel environment variables.'
    );
  }

  return {
    build: {
      // Output directory for the build (default is 'dist')
      outDir: 'dist', 
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
      },
    },
    // Define global constants replacements
    // This is crucial for process.env.API_KEY to work in client-side code (index.tsx)
    define: {
      // Tu código cliente (index.tsx) espera process.env.API_KEY.
      // Aquí, tomamos el valor de CLAVE_API (leído de Vercel) y lo asignamos a process.env.API_KEY.
      'process.env.API_KEY': JSON.stringify(apiKeyFromVercelEnv),
    },
    resolve: {
      alias: {
        // Setup aliases if you have specific path requirements, e.g.:
        // '@': resolve(__dirname, './src'),
      },
    },
    // server: { // Optional: Vite dev server specific settings
    //   port: 3000,
    // },
  };
});
