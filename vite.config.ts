import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// ChaiLM Custom Theme Definitions
export const themeConfig = {
  fonts: {
    serif: "'Fraunces', ui-serif, Georgia, serif",
    sans: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  colors: {
    // Exhibit Ledger Theme (Landing & Marketing)
    exhibit: {
      paper: '#F5F6F4',
      surface: '#FFFFFF',
      surface2: '#F0F1EE',
      hairline: '#E2E4E1',
      hairlineStrong: '#CBCFC9',
      ink: '#14171A',
      slate: '#5C6169',
      slateFaint: '#93968F',
      cobalt: '#1E2A5E',
      verified: '#1F7A5C',
    },
    // ChaiLM Dark Studio Theme (Workspace App)
    chailm: {
      bg: '#131314',
      panel: '#1E1F20',
      card: '#28292A',
      hover: '#333537',
      border: '#37393B',
      textMain: '#E3E2E6',
      textMuted: '#C4C7C5',
      accentBlue: '#A8C7FA',
    },
  },
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    __CHAILM_THEME__: JSON.stringify(themeConfig),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
