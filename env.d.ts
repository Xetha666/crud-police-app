/// <reference types="astro/client" />

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