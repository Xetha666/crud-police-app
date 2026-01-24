/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly DB_USER_PASSWORD: string;
  readonly JWT_SECRET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
interface UserSession {
  id: number;
  username: string;
  name: string;
}

declare namespace App {
  interface Locals {
    user?: UserSession;
  }
}