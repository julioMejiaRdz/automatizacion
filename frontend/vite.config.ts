import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

function themeInitPlugin(): Plugin {
  return {
    name: 'theme-init',
    transformIndexHtml(html) {
      const script = `<script>(function(){var t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')})()</script>`
      return html.replace('</head>', `  ${script}\n  </head>`)
    }
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), themeInitPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
})
