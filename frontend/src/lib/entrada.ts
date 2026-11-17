/**
 * Avisa de cuándo se ha retirado la pantalla de carga.
 *
 * Hace falta porque la portada se dibuja **detrás** de la pantalla de carga: sin esta señal,
 * el avance automático de la secuencia se reproduciría escondido y la persona vería la
 * fachada ya quieta al entrar. `RootLayout` llama a `marcarEntradaLista()` en cuanto no hay
 * pantalla de carga (y también en las rutas que no la muestran).
 */
let lista = false
const enEspera = new Set<() => void>()

export function marcarEntradaLista() {
  if (lista) return
  lista = true
  for (const avisar of enEspera) avisar()
  enEspera.clear()
}

/** Ejecuta `avisar` ya, o en cuanto se retire la pantalla de carga. Devuelve cómo cancelarlo. */
export function alEstarListaLaEntrada(avisar: () => void) {
  if (lista) {
    avisar()
    return () => {}
  }
  enEspera.add(avisar)
  return () => enEspera.delete(avisar)
}
