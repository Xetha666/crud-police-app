import type { APIRoute } from 'astro';
import { Armamento, db, eq, InfoPNP, Personal, VidaSocial } from 'astro:db';
import fs from 'node:fs/promises';
import path from 'node:path';

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params;

  if (!id) return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

  try {
    const p_id = Number(id);

    // 1. Borrado de archivo físico
    const person = await db.select().from(Personal).where(eq(Personal.id, p_id)).get();
    if (person?.foto && person.foto !== "--") {
      const filePath = path.join(process.cwd(), 'public', person.foto);
      await fs.unlink(filePath).catch(() => console.log("Archivo no encontrado en disco"));
    }

    // 2. Borrado en cascada manual
    await db.delete(Armamento).where(eq(Armamento.personal_id, p_id));
    await db.delete(InfoPNP).where(eq(InfoPNP.personal_id, p_id));
    await db.delete(VidaSocial).where(eq(VidaSocial.personal_id, p_id));
    await db.delete(Personal).where(eq(Personal.id, p_id));

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};