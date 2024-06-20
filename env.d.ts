/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly X_API_KEY: string;
  readonly VITE_BASE_URL: string;
  // Outras variáveis de ambiente que você pode ter
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}