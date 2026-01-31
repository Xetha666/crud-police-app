import type { APIRoute } from 'astro';
import { Armamento, db, eq, InfoPNP, Personal, VidaSocial } from 'astro:db';
import fs from 'node:fs/promises';
import path from 'node:path';

export const GET: APIRoute = async ({ params }) => {
  const { id } = params;

  try {
    // Traemos la mayoria de datos
    const results = await db.select()
      .from(Personal)
      .where(eq(Personal.id, Number(id)))
      .innerJoin(InfoPNP, eq(Personal.id, InfoPNP.personal_id))
      .innerJoin(VidaSocial, eq(Personal.id, VidaSocial.personal_id));

    if (results.length === 0) {
      return new Response(JSON.stringify({ error: 'Efectivo no encontrado' }), { status: 404 });
    }

    // Traemos también sus armas
    const weapons = await db.select().from(Armamento).where(eq(Armamento.personal_id, Number(id)));
    const data = results[0];

    return new Response(JSON.stringify({
      Personal: data.Personal,
      InfoPNP: data.InfoPNP,
      VidaSocial: data.VidaSocial,
      weapons: weapons
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al obtener datos' }), { status: 500 });
  }
}

export const PUT: APIRoute = async ({ params, request }) => {
  const { id: idParam } = params;
  const id = Number(idParam);
  
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const fotoFile = formData.get('foto') as File;

  try {
    let fotoPath = null;

    // --- LÓGICA DE ARCHIVO LOCAL ---
    // Solo procesamos si el archivo tiene contenido real
    if (fotoFile && fotoFile.size > 0 && fotoFile.name !== 'undefined') {
      const fileName = `${Date.now()}-${fotoFile.name}`;
      const publicPath = path.join(process.cwd(), 'public', 'uploads');
      const filePath = path.join(publicPath, fileName);

      // Asegurar que la carpeta exista
      await fs.mkdir(publicPath, { recursive: true });
      
      const arrayBuffer = await fotoFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      
      fotoPath = `/uploads/${fileName}`;
    }

    // --- 1. ACTUALIZAR TABLA PERSONAL ---
    await db.update(Personal)
      .set({
        grado: String(data.grado || ""),
        apellidos_nombres: String(data.apellidos_nombres || ""),
        dni: String(data.dni || ""),
        sexo: String(data.sexo || ""),
        edad: String(data.edad || ""),
        distrito_nac: String(data.distrito_nac || ""),
        provincia_nac: String(data.provincia_nac || ""),
        depto_nac: String(data.depto_nac || ""),
        fecha_nac: String(data.fecha_nac || ""),
        codigo_dni: String(data.codigo_dni || ""),
        // Solo actualiza la foto si se subió una nueva
        ...(fotoPath ? { foto: fotoPath } : {})
      })
      .where(eq(Personal.id, id));

    // --- 2. ACTUALIZAR TABLA INFOPNP ---
    await db.update(InfoPNP)
      .set({
        sub_unidad_situacion: String(data.sub_unidad_situacion || ""),
        sede_depincri: String(data.sede_depincri || ""),
        area_oficina: String(data.area_oficina || ""),
        ingreso_pnp: String(data.ingreso_pnp || ""),
        egreso_pnp: String(data.egreso_pnp || ""),
        tiempo_servicio_anios: String(data.tiempo_servicio_anios || ""),
        tiempo_servicio_meses: String(data.tiempo_servicio_meses || ""),
        tiempo_servicio_dias: String(data.tiempo_servicio_dias || ""),
        codigo_especialidad: String(data.codigo_especialidad || ""),
        cip_antiguo_codofin: String(data.cip_antiguo_codofin || ""),
        cip_numero: String(data.cip_numero || ""),
        cip_situacion: String(data.cip_situacion || ""),
        cip_fecha_expedicion: String(data.cip_fecha_expedicion || ""),
        ultimo_ascenso: String(data.ultimo_ascenso || ""),
        grupo_sanguineo: String(data.grupo_sanguineo || ""),
        incorp_divpol_chyo: String(data.incorp_divpol_chyo || ""),
        incorp_depincri: String(data.incorp_depincri || ""),
        cargo: String(data.cargo || ""),
        codigo_cargo: String(data.codigo_cargo || ""),
        funcion_horario: String(data.funcion_horario || ""),
        aptitud_psicosomatica: String(data.aptitud_psicosomatica || ""),
        procedencia: String(data.procedencia || ""),
        calidad_incorporacion: String(data.calidad_incorporacion || ""),
      })
      .where(eq(InfoPNP.personal_id, id));

    // --- 3. ACTUALIZAR TABLA VIDASOCIAL ---
    await db.update(VidaSocial)
      .set({
        estado_civil: String(data.estado_civil || ""),
        direccion: String(data.direccion || ""),
        referencia_domiciliaria: String(data.referencia_domiciliaria || ""),
        distrito_dom: String(data.distrito_dom || ""),
        provincia_dom: String(data.provincia_dom || ""),
        depto_dom: String(data.depto_dom || ""),
        bn_cuenta_corriente: String(data.bn_cuenta_corriente || ""),
        bn_cci: String(data.bn_cci || ""),
        email_gmail: String(data.email_gmail || ""),
        email_hotmail: String(data.email_hotmail || ""),
        email_institucional: String(data.email_institucional || ""),
        telf_rpc: String(data.telf_rpc || ""),
        telf_rpm: String(data.telf_rpm || ""),
        telf_entel: String(data.telf_entel || ""),
        telf_bitel: String(data.telf_bitel || ""),
        telf_wsp: String(data.telf_wsp || ""),
        telf_casa: String(data.telf_casa || ""),
        reasig_tipo_doc: String(data.reasig_tipo_doc || ""),
        reasig_num: String(data.reasig_num || ""),
        reasig_procedencia: String(data.reasig_procedencia || ""),
        reasig_fecha: String(data.reasig_fecha || ""),
      })
      .where(eq(VidaSocial.personal_id, id));

    return new Response(JSON.stringify({ message: "Éxito" }), { status: 200 });

  } catch (error) {
    console.error("Error en PUT:", error);
    return new Response(JSON.stringify({ error: "Error interno" }), { status: 500 });
  }
}

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