import { column, defineDb, defineTable } from 'astro:db';

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    username: column.text({ unique: true }),
    password: column.text(),
    name: column.text({ optional: true }),
    createdAt: column.date({ default: new Date() }),
  }
})

// TABLA 1: Identidad (El Corazón)
const Personal = defineTable({
  columns: {
    id: column.number({ primaryKey: true, autoIncrement: true }),
    foto: column.text(),
    grado: column.text(),
    apellidos_nombres: column.text(),
    sexo: column.text(),
    dni: column.text({ unique: true }),
    codigo_dni: column.text(),
    fecha_nac: column.text(),
    edad: column.text(),
    distrito_nac: column.text(),
    provincia_nac: column.text(),
    depto_nac: column.text(),
  }
});

// TABLA 2: Información PNP (Laboral)
const InfoPNP = defineTable({
  columns: {
    personal_id: column.number({ references: () => Personal.columns.id }),
    sub_unidad_situacion: column.text(),
    sede_depincri: column.text(),
    area_oficina: column.text(),
    ingreso_pnp: column.text(),
    egreso_pnp: column.text(),
    tiempo_servicio_anios: column.text(),
    tiempo_servicio_meses: column.text(),
    tiempo_servicio_dias: column.text(),
    codigo_especialidad: column.text(),
    cip_antiguo_codofin: column.text(),
    cip_numero: column.text(),
    cip_situacion: column.text(),
    cip_fecha_expedicion: column.text(),
    ultimo_ascenso: column.text(),
    grupo_sanguineo: column.text(),
    incorp_divpol_chyo: column.text(),
    incorp_depincri: column.text(),
    cargo: column.text(),
    codigo_cargo: column.text(),
    funcion_horario: column.text(),
    aptitud_psicosomatica: column.text(),
    procedencia: column.text(),
    calidad_incorporacion: column.text(),
  }
});

// TABLA 3: Armamento (Logística)
const Armamento = defineTable({
  columns: {
    id: column.number({ primaryKey: true }),
    personal_id: column.number({ references: () => Personal.columns.id }),
    tipo_procedencia: column.text(), // Aquí irá "PARTICULAR" o "ESTADO"
    tipo_arma: column.text(),
    marca: column.text(),
    modelo: column.text(),
    calibre: column.text(),
    serie: column.text(),
    caf_num: column.text(),
    caf_exped: column.text(),
    caf_caduca: column.text(),
    caf_libro: column.text(),
    caf_folio: column.text(),
    tarjeta_num: column.text(),
    tarjeta_emision: column.text(),
  }
});

// TABLA 4: Vida Social y Reasignación (Domicilio, Licencias, etc.)
const VidaSocial = defineTable({
  columns: {
    personal_id: column.number({ references: () => Personal.columns.id }),
    // Licencias Mayor
    lic_mayor_particular: column.text(),
    lic_mayor_policial: column.text(),
    lic_mayor_militar: column.text(),
    lic_mayor_clase: column.text(),
    lic_mayor_categoria: column.text(),
    lic_mayor_f_exped: column.text(),
    lic_mayor_f_caduc: column.text(),
    // Licencias Menor
    lic_menor_particular: column.text(),
    lic_menor_policial: column.text(),
    lic_menor_militar: column.text(),
    lic_menor_clase: column.text(),
    lic_menor_categoria: column.text(),
    lic_menor_f_exped: column.text(),
    lic_menor_f_caduc: column.text(),
    // Domicilio y Economía
    estado_civil: column.text(),
    direccion: column.text(),
    referencia_domiciliaria: column.text(),
    distrito_dom: column.text(),
    provincia_dom: column.text(),
    depto_dom: column.text(),
    bn_cuenta_corriente: column.text(),
    bn_cci: column.text(),
    // Comunicaciones
    email_gmail: column.text(),
    email_hotmail: column.text(),
    email_institucional: column.text(),
    telf_rpc: column.text(),
    telf_rpm: column.text(),
    telf_entel: column.text(),
    telf_bitel: column.text(),
    telf_wsp: column.text(),
    telf_casa: column.text(),
    // Reasignación
    reasig_tipo_doc: column.text(),
    reasig_num: column.text(),
    reasig_procedencia: column.text(),
    reasig_fecha: column.text(),
  }
});

export default defineDb({
  tables: { User, Personal, InfoPNP, Armamento, VidaSocial }
});
