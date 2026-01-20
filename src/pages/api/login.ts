import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  const { username, password } = await request.json();

  return new Response(
    JSON.stringify(
        { message: `User ${username} and password ${password} received.` }
    ),
  );
};