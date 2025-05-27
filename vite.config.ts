import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on mode
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      // Output directory for production build
      outDir: 'dist',
      // Optimize build
      minify: 'terser',
      // Split chunks for better loading performance
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            ui: ['lucide-react', 'react-markdown'],
            export: ['jspdf', 'jspdf-autotable', 'pptxgenjs'],
          },
        },
      },
    },
    server: {
      port: 5173
    },
    // Define environment variables to expose to the client
    define: {
      'import.meta.env.VITE_OPENAI_API_KEY': JSON.stringify(env.VITE_OPENAI_API_KEY),
    },
  };
});