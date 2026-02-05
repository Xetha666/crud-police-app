import { personalSchema } from '@/lib/schemas/personal';
import type { APIRoute } from 'astro';
import { Armamento, db, eq, InfoPNP, Personal, VidaSocial } from 'astro:db';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET() {
  const allPersonal = await db.select().from(Personal).innerJoin(InfoPNP, eq(Personal.id, InfoPNP.personal_id));
                                                    
  const hoy = new Date();

  const allPersonalWithServiceTime = allPersonal.map((personal) => {
    const fechaEgreso = new Date(personal.InfoPNP.egreso_pnp);
    
    // Cálculo de años
    let anios = hoy.getFullYear() - fechaEgreso.getFullYear();
    const mes = hoy.getMonth() - fechaEgreso.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaEgreso.getDate())) {
      anios--;
    }

    return {
      ...personal,
      tiempo_servicio_actual: anios // Este dato siempre será fresco
    };
  });

  return new Response(JSON.stringify(allPersonalWithServiceTime));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const fotoFile = formData.get('foto') as File | null;
    let fotoPath = "--";

    // 1. Procesamiento físico de la imagen
    if (fotoFile && fotoFile.size > 0 && fotoFile.name !== "undefined") {
      const fileName = `${Date.now()}-${fotoFile.name.replace(/\s+/g, '_')}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      // Crear carpeta si no existe
      await fs.mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, fileName);
      const arrayBuffer = await fotoFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(arrayBuffer));
      
      fotoPath = `/uploads/${fileName}`;
    }

    const rawData = Object.fromEntries(formData);
    const dataToValidate = {
      ...rawData,
      foto: fotoFile // Pasamos el archivo real para que Zod valide la extensión
    };

    // 3. Validar con el Schema de Zod
    const validatedData = personalSchema.parse(dataToValidate);

    // 4. EXTRAER LOS DATOS Y LIMPIAR LA FOTO
    // Sacamos 'foto' de validatedData para que no nos moleste
    const { foto: _, ...personalDataWithoutFoto } = validatedData;

    // 5. INSERTAR EN TABLA: PERSONAL
    const [newPersonal] = await db.insert(Personal).values({
      ...personalDataWithoutFoto, 
      foto: fotoPath,             
    }).returning();

    const p_id = newPersonal.id;

    // 6. INSERTAR EN TABLA: INFOPNP
    await db.insert(InfoPNP).values({
      personal_id: p_id,
      sub_unidad_situacion: validatedData.sub_unidad_situacion,
      sede_depincri: validatedData.sede_depincri,
      area_oficina: validatedData.area_oficina,
      ingreso_pnp: validatedData.ingreso_pnp,
      egreso_pnp: validatedData.egreso_pnp,
      tiempo_servicio_anios: validatedData.tiempo_servicio_anios,
      tiempo_servicio_meses: validatedData.tiempo_servicio_meses,
      tiempo_servicio_dias: validatedData.tiempo_servicio_dias,
      codigo_especialidad: validatedData.codigo_especialidad,
      cip_antiguo_codofin: validatedData.cip_antiguo_codofin,
      cip_numero: validatedData.cip_numero,
      cip_situacion: validatedData.cip_situacion,
      cip_fecha_expedicion: validatedData.cip_fecha_expedicion,
      ultimo_ascenso: validatedData.ultimo_ascenso,
      grupo_sanguineo: validatedData.grupo_sanguineo,
      incorp_divpol_chyo: validatedData.incorp_divpol_chyo,
      incorp_depincri: validatedData.incorp_depincri,
      cargo: validatedData.cargo,
      codigo_cargo: validatedData.codigo_cargo,
      funcion_horario: validatedData.funcion_horario,
      aptitud_psicosomatica: validatedData.aptitud_psicosomatica,
      procedencia: validatedData.procedencia,
      calidad_incorporacion: validatedData.calidad_incorporacion,
    });

    // 7. INSERTAR EN TABLA: VIDASOCIAL (Licencias, Domicilio, Comunicación)
    await db.insert(VidaSocial).values({
      personal_id: p_id,
      // Licencias Mayor
      lic_mayor_particular: validatedData.lic_mayor_particular,
      lic_mayor_policial: validatedData.lic_mayor_policial,
      lic_mayor_militar: validatedData.lic_mayor_militar,
      lic_mayor_clase: validatedData.lic_mayor_clase,
      lic_mayor_categoria: validatedData.lic_mayor_categoria,
      lic_mayor_f_exped: validatedData.lic_mayor_f_exped,
      lic_mayor_f_caduc: validatedData.lic_mayor_f_caduc,
      // Licencias Menor
      lic_menor_particular: validatedData.lic_menor_particular,
      lic_menor_policial: validatedData.lic_menor_policial,
      lic_menor_militar: validatedData.lic_menor_militar,
      lic_menor_clase: validatedData.lic_menor_clase,
      lic_menor_categoria: validatedData.lic_menor_categoria,
      lic_menor_f_exped: validatedData.lic_menor_f_exped,
      lic_menor_f_caduc: validatedData.lic_menor_f_caduc,
      // Domicilio
      estado_civil: validatedData.estado_civil,
      direccion: validatedData.direccion,
      referencia_domiciliaria: validatedData.referencia_domiciliaria,
      distrito_dom: validatedData.distrito_dom,
      provincia_dom: validatedData.provincia_dom,
      depto_dom: validatedData.depto_dom,
      bn_cuenta_corriente: validatedData.bn_cuenta_corriente,
      bn_cci: validatedData.bn_cci,
      // Comunicaciones
      email_gmail: validatedData.email_gmail,
      email_hotmail: validatedData.email_hotmail,
      email_institucional: validatedData.email_institucional,
      telf_rpc: validatedData.telf_rpc,
      telf_rpm: validatedData.telf_rpm,
      telf_entel: validatedData.telf_entel,
      telf_bitel: validatedData.telf_bitel,
      telf_wsp: validatedData.telf_wsp,
      telf_casa: validatedData.telf_casa,
      // Reasignación
      reasig_tipo_doc: validatedData.reasig_tipo_doc,
      reasig_num: validatedData.reasig_num,
      reasig_procedencia: validatedData.reasig_procedencia,
      reasig_fecha: validatedData.reasig_fecha,
    });

    // 8. INSERTAR EN TABLA: ARMAMENTO (Lógica 1:N)
    // Registro de Arma Particular (solo si hay serie)
    if (validatedData.arma_part_serie !== "--") {
      await db.insert(Armamento).values({
        personal_id: p_id,
        tipo_procedencia: "PARTICULAR",
        tipo_arma: validatedData.arma_part_tipo,
        marca: validatedData.arma_part_marca,
        modelo: validatedData.arma_part_modelo,
        calibre: validatedData.arma_part_calibre,
        serie: validatedData.arma_part_serie,
        caf_num: validatedData.arma_part_caf_num,
        caf_exped: validatedData.arma_part_caf_exped,
        caf_caduca: validatedData.arma_part_caf_caduca,
        caf_libro: validatedData.arma_part_caf_libro,
        caf_folio: validatedData.arma_part_caf_folio,
        tarjeta_num: validatedData.arma_part_tarjeta_num,
        tarjeta_emision: validatedData.arma_part_tarjeta_emision,
      });
    }

    // Registro de Arma del Estado (solo si hay serie)
    if (validatedData.arma_est_serie !== "--") {
      await db.insert(Armamento).values({
        personal_id: p_id,
        tipo_procedencia: "ESTADO",
        tipo_arma: validatedData.arma_est_tipo,
        marca: validatedData.arma_est_marca,
        modelo: validatedData.arma_est_modelo,
        calibre: validatedData.arma_est_calibre,
        serie: validatedData.arma_est_serie,
        caf_num: validatedData.arma_est_caf_num,
        caf_exped: validatedData.arma_est_caf_exped,
        caf_caduca: validatedData.arma_est_caf_caduca,
        caf_libro: validatedData.arma_est_caf_libro,
        caf_folio: validatedData.arma_est_caf_folio,
        tarjeta_num: validatedData.arma_est_tarjeta_num,
        tarjeta_emision: validatedData.arma_est_tarjeta_emision,
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Personal registrado correctamente en las 4 tablas." 
    }), { status: 201 });

  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message || "Error interno al procesar el registro" 
    }), { status: 400 });
  }
};
