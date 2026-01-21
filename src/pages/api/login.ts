import type { APIRoute } from "astro";
import { and, db, eq, User } from "astro:db";

export const POST: APIRoute = async ({ request }) => {
  const { username, password } = await request.json();
  if (!username || !password) {
    return new Response(
      JSON.stringify(
        {
          error: "Username and password are required."
        }
      ),
      { status: 400 }
    );
  }
  try {

  const userFound = await db.select().from(User).where(and(eq(User.username, username),eq(User.password, password))).get();
  
  if (!userFound) {
      return new Response(
        JSON.stringify({ error: "Credenciales incorrectas." }),
        { status: 401 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Login exitoso",
        user: { 
          id: userFound.id, 
          username: userFound.username 
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