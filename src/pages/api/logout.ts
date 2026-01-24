import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
    // 1. Borrar la cookie (Añadimos path: '/' para asegurar que se limpie en toda la app)
    cookies.delete('auth_token', { path: '/' });

    // 2. Redirigir usando el método nativo de Astro para APIs ,esto reemplaza al Response manual y al window.location
    return redirect('/login', 302);
}