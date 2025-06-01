
import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  // Log the API_KEY as seen by Vite during the build process
  // This log will appear in Vercel's build logs
  console.log(`[vite.config.js] Build command: ${command}, Mode: ${mode}`);
  const apiKeyFromEnv = process.env.API_KEY;
  console.log(`[vite.config.js] API_KEY from build environment: "${apiKeyFromEnv}"`);

  if (command === 'build' && !apiKeyFromEnv) {
    console.warn(
      '[vite.config.js] WARNING: API_KEY is not defined or empty in the build environment! The application will likely fail to connect to the Gemini API.'
    );
    // Consider failing the build if the API key is absolutely mandatory:
    // throw new Error("API_KEY is not defined for production build. Please set it in Vercel environment variables.");
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
    // This is crucial for process.env.API_KEY to work in client-side code
    define: {
      'process.env.API_KEY': JSON.stringify(apiKeyFromEnv),
      // You can define other environment variables here if needed
      // 'process.env.NODE_ENV': JSON.stringify(mode),
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
