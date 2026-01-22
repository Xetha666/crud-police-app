import type { APIRoute } from "astro";
import { and, db, eq, User } from "astro:db";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(import.meta.env.JWT_SECRET);

export const POST: APIRoute = async ({ request, cookies }) => {
  const { username, password } = await request.json();
  if (!username || !password) {
    return new Response(
      JSON.stringify(
        {
          error: "Usuario y contraseña son requeridos."
        }
      ),
      { status: 400 }
    );
  }
  try {
    const debugUsers = await db.select().from(User);
    console.log("--- USUARIOS DISPONIBLES EN DB ---", debugUsers);
console.log("Datos recibidos:", { username, password });
const userFound = await db.select().from(User).where(and(eq(User.username, username),eq(User.password, password))).get();
console.log("Usuario encontrado:", userFound);  
  if (!userFound) {
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas." }),
        { status: 401 }
      );
    }

    // --- PASO CLAVE: CREACIÓN DEL TOKEN ---
    const token = await new SignJWT({ 
        id: userFound.id, 
        username: userFound.username,
        name: userFound.name
      })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("4h") 
      .sign(SECRET);

    // --- PASO CLAVE: SETEO DE LA COOKIE SEGURA ---
    cookies.set("auth_token", token, {
      path: "/",
      httpOnly: true, // Seguridad XSS: No accesible por JS del cliente
      secure: import.meta.env.PROD, // Solo HTTPS en producción
      sameSite: "strict",
      maxAge: 60 * 60 * 4, // 4 horas de persistencia
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login exitoso",
        user: { 
          id: userFound.id, 
          username: userFound.username,
          name: userFound.name
        }
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error interno del servidor." }),
      { status: 500 }
    );
  }
};