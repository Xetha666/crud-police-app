import { z } from "zod";

const ACCEPTED_EXTENSIONS = ['jpg', 'jpeg', 'png'];

// Función para transformar campos vacíos en "--"
const optionalField = z.string()
    .optional()
    .transform((val) => (!val || val.trim() === "") ? "" : val);

export const personalSchema = z.object({
    // I. IDENTIDAD Y GRADO
    foto: z.any().optional()
        .refine((file) => {
            // Si no hay archivo, pasa (es opcional)
            if (!file || !file.name) return true;
            
            const fileName = file.name.toLowerCase();
            // 2. Usamos .some() para verificar contra la constante
            return ACCEPTED_EXTENSIONS.some(ext => fileName.endsWith(ext));
        }, `Solo se permiten los formatos: ${ACCEPTED_EXTENSIONS.join(", ")}`),

    sub_unidad_situacion: optionalField,
    sede_depincri: optionalField,
    area_oficina: optionalField,
    grado: optionalField,
    apellidos_nombres: z.string()
                            .min(1, "El nombre es obligatorio")
                            .regex(/^[A-ZÑÁÉÍÓÚa-zñáéíóú\s]+ [A-ZÑÁÉÍÓÚa-zñáéíóú\s]+$/, {
                                message: "Debe ingresar Apellidos y Nombres separados por un espacio"}),
    sexo: optionalField,
    distrito_nac: optionalField,
    provincia_nac: optionalField,
    depto_nac: optionalField,
    fecha_nac: optionalField,
    edad: optionalField,

    // II. INFORMACIÓN PNP
    dni: z.string().length(8, "El DNI debe tener 8 dígitos"), // Obligatorio
    codigo_dni: optionalField,
    ingreso_pnp: optionalField,
    egreso_pnp: optionalField,
    tiempo_servicio_anios: optionalField,
    tiempo_servicio_meses: optionalField,
    tiempo_servicio_dias: optionalField,
    codigo_especialidad: optionalField,
    cip_antiguo_codofin: optionalField,
    cip_numero: optionalField,
    cip_situacion: optionalField,
    cip_fecha_expedicion: optionalField,
    ultimo_ascenso: optionalField,
    grupo_sanguineo: optionalField,
    incorp_divpol_chyo: optionalField,
    incorp_depincri: optionalField,
    cargo: optionalField,
    codigo_cargo: optionalField,
    funcion_horario: optionalField,
    aptitud_psicosomatica: optionalField,
    procedencia: optionalField,
    calidad_incorporacion: optionalField,

    // III. ARMAMENTO PARTICULAR
    arma_part_tipo: optionalField,
    arma_part_marca: optionalField,
    arma_part_modelo: optionalField,
    arma_part_calibre: optionalField,
    arma_part_serie: optionalField,
    arma_part_caf_num: optionalField,
    arma_part_caf_exped: optionalField,
    arma_part_caf_caduca: optionalField,
    arma_part_caf_libro: optionalField,
    arma_part_caf_folio: optionalField,
    arma_part_tarjeta_num: optionalField,
    arma_part_tarjeta_emision: optionalField,

    // III. ARMAMENTO ESTADO
    arma_est_tipo: optionalField,
    arma_est_marca: optionalField,
    arma_est_modelo: optionalField,
    arma_est_calibre: optionalField,
    arma_est_serie: optionalField,
    arma_est_caf_num: optionalField,
    arma_est_caf_exped: optionalField,
    arma_est_caf_caduca: optionalField,
    arma_est_caf_libro: optionalField,
    arma_est_caf_folio: optionalField,
    arma_est_tarjeta_num: optionalField,
    arma_est_tarjeta_emision: optionalField,

    // IV. LICENCIAS DE CONDUCIR (MAYOR)
    lic_mayor_particular: optionalField,
    lic_mayor_policial: optionalField,
    lic_mayor_militar: optionalField,
    lic_mayor_clase: optionalField,
    lic_mayor_categoria: optionalField,
    lic_mayor_f_exped: optionalField,
    lic_mayor_f_caduc: optionalField,

    // IV. LICENCIAS DE CONDUCIR (MENOR)
    lic_menor_particular: optionalField,
    lic_menor_policial: optionalField,
    lic_menor_militar: optionalField,
    lic_menor_clase: optionalField,
    lic_menor_categoria: optionalField,
    lic_menor_f_exped: optionalField,
    lic_menor_f_caduc: optionalField,

    // V. DOMICILIO Y ECONOMÍA
    estado_civil: optionalField,
    direccion: optionalField,
    referencia_domiciliaria: optionalField,
    distrito_dom: optionalField,
    provincia_dom: optionalField,
    depto_dom: optionalField,
    bn_cuenta_corriente: optionalField,
    bn_cci: optionalField,

    // VI. COMUNICACIONES (CORREO)
    email_gmail: optionalField,
    email_hotmail: optionalField,
    email_institucional: optionalField,

    // VII. COMUNICACIONES (CELULAR)
    telf_rpc: optionalField,
    telf_rpm: optionalField,
    telf_entel: optionalField,
    telf_bitel: optionalField,
    telf_wsp: optionalField,
    telf_casa: optionalField,

    // VIII. REASIGNACIÓN
    reasig_tipo_doc: optionalField,
    reasig_num: optionalField,
    reasig_procedencia: optionalField,
    reasig_fecha: optionalField,
});

export type Personal = z.infer<typeof personalSchema>;

