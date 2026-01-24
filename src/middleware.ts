import { defineMiddleware } from "astro:middleware";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(import.meta.env.JWT_SECRET);

export const onRequest = defineMiddleware(async (context, next) => {
  // Solo protegemos la ruta de opciones y cualquier sub-ruta que nazca de ella
  const isProtectedPage = context.url.pathname.startsWith("/options");

  if (isProtectedPage) {
    const token = context.cookies.get("auth_token")?.value;

    if (!token) {
      // Si no hay token, el usuario es enviado al login
      return context.redirect("/login");
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);
      
      // Inyectamos los datos para que Options.astro pueda usarlos
      context.locals.user = {
        id: payload.id as number,
        username: payload.username as string,
        name: payload.name as string,
      };
    } catch (e) {
      // Si el token falló (por ejemplo, si alguien intentó editar la cookie)
      context.cookies.delete("auth_token", { path: "/" });
      return context.redirect("/login");
    }
  }

  return next();
});