/// <reference types="astro/client" />

interface UserSession {
  id: number;
  username: string;
}

declare namespace App {
  interface Locals {
    user?: UserSession;
  }
}