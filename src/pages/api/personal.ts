import { personalSchema } from '@/lib/schemas/personal';
import type { APIRoute } from 'astro';
import { Armamento, db, InfoPNP, Personal, VidaSocial } from 'astro:db';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    // 1. Validar con Zod (Asegura que los vacíos sean "--")
    const validatedData = personalSchema.parse(data);

    // 2. INSERTAR EN TABLA: PERSONAL (Retorna el ID)
    const [newPersonal] = await db.insert(Personal).values({
      foto: "--", // Manejaremos la subida de imagen en el siguiente paso
      grado: validatedData.grado,
      apellidos_nombres: validatedData.apellidos_nombres,
      sexo: validatedData.sexo,
      dni: validatedData.dni,
      codigo_dni: validatedData.codigo_dni,
      fecha_nac: validatedData.fecha_nac,
      edad: validatedData.edad,
      distrito_nac: validatedData.distrito_nac,
      provincia_nac: validatedData.provincia_nac,
      depto_nac: validatedData.depto_nac,
    }).returning();

    const p_id = newPersonal.id;

    // 3. INSERTAR EN TABLA: INFOPNP
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

    // 4. INSERTAR EN TABLA: VIDASOCIAL (Licencias, Domicilio, Comunicación)
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

    // 5. INSERTAR EN TABLA: ARMAMENTO (Lógica 1:N)
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