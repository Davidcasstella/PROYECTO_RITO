/**
 * Platos en 3D de la carta.
 *
 * Son MODELOS DE MUESTRA: escaneos del proyecto de referencia (los mismos de Áureo y del
 * restaurante italiano, material del propio cliente) puestos con los nombres de platos reales
 * de la carta de RITO para enseñar cómo se vería la experiencia. Por eso la web lo dice
 * ("vista de muestra") y no promete que el plato sea idéntico. Cuando RITO escanee sus
 * platos, basta con cambiar el `.glb`/`.usdz` y la descripción.
 *
 * - `.glb`: lo que se ve en el navegador y en Android.
 * - `.usdz`: realidad aumentada en iPhone/iPad. Si falta, `<model-viewer>` lo genera.
 * - `escala: 1`: los escaneos ya vienen en metros, así que en realidad aumentada se ven a
 *   tamaño real.
 */
export type Modelo3D = {
  /** Igual al id del plato en `features/menu/menu.ts`. */
  id: string
  glb: string
  usdz?: string
  escala: number
  /** Medida aproximada del plato del escaneo. */
  tamanoReal: string
  /** Lo que se ve en el modelo, para quien no puede verlo. */
  alt: string
}

const m = (id: string, tamanoReal: string, alt: string, usdz = true): Modelo3D => ({
  id,
  glb: `/models/${id}.glb`,
  usdz: usdz ? `/models/${id}.usdz` : undefined,
  escala: 1,
  tamanoReal,
  alt,
})

export const modelos3d: Modelo3D[] = [
  m(
    'churrasco',
    'Plato de 32 cm',
    'Modelo 3D de muestra: plato blanco con un corte de carne a la parrilla, papas en gajos, arroz y ensalada de tomate y aguacate.',
  ),
  m(
    'burger-la-plena',
    'Plato hondo de 23 cm',
    'Modelo 3D de muestra: pan con carne en tiras, tomates cherry, lechuga y papas fritas onduladas.',
  ),
  m(
    'parrillada',
    'Plancha de 22 cm',
    'Modelo 3D de muestra: plancha de hierro sobre base de madera, con carne en tiras salteada.',
    false,
  ),
  m(
    'costillas',
    'Cuenco de 22 cm',
    'Modelo 3D de muestra: cuenco blanco en una cesta de bambú, con trozos de carne en salsa oscura y cilantro.',
  ),
  m(
    'pechuga-napolitana',
    'Plato de 26 cm',
    'Modelo 3D de muestra: plato de cerámica con un gratinado de tomate y queso fundido.',
  ),
  m(
    'pasta-marinera',
    'Plato hondo de 23 cm',
    'Modelo 3D de muestra: plato hondo con fideos anchos en salsa, un huevo y hojas verdes.',
  ),
  m(
    'vegano-rito',
    'Plato de 27 cm',
    'Modelo 3D de muestra: plato con verduras verdes, pepino, brotes, tofu y un cuenco de salsa.',
  ),
  m(
    'canastas-patacon',
    'Plato de 73 cm',
    'Modelo 3D de muestra: plato grande con bocados colocados en círculo, en rojo, verde y dorado.',
    false,
  ),
]

export function modeloPorId(id: string) {
  return modelos3d.find((modelo) => modelo.id === id)
}
