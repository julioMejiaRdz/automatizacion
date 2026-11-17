/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_APP_DESCRIPTION?: string
  readonly VITE_APP_LOGO?: string
  readonly VITE_BRAND_COLOR?: string
  readonly VITE_FOOTER_TEXT?: string
  readonly VITE_API_URL: string
  readonly VITE_WS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
