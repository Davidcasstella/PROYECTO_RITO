import { useEffect } from 'react'

/** Crea la etiqueta si no existe y devuelve su valor anterior, para poder restaurarlo. */
function ponerMeta(selector: string, atributos: Record<string, string>, contenido: string) {
  let etiqueta = document.head.querySelector<HTMLMetaElement>(selector)
  if (!etiqueta) {
    etiqueta = document.createElement('meta')
    for (const [clave, valor] of Object.entries(atributos)) etiqueta.setAttribute(clave, valor)
    document.head.appendChild(etiqueta)
  }
  const anterior = etiqueta.content
  etiqueta.content = contenido
  return anterior
}

/**
 * Pone el título y la descripción de la página (y sus equivalentes de Open Graph).
 *
 * El sitio es una SPA: el `index.html` solo trae los valores de la portada, así que cada
 * página los actualiza al entrar y los deja como estaban al salir.
 */
export function useDocumentMeta({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    const tituloAnterior = document.title
    document.title = title

    const anteriores = [
      ['meta[name="description"]', { name: 'description' }] as const,
      ['meta[property="og:title"]', { property: 'og:title' }] as const,
      ['meta[property="og:description"]', { property: 'og:description' }] as const,
      ['meta[name="twitter:title"]', { name: 'twitter:title' }] as const,
      ['meta[name="twitter:description"]', { name: 'twitter:description' }] as const,
    ].map(([selector, atributos]) => {
      const esTitulo = selector.includes('title')
      return [
        selector,
        atributos,
        ponerMeta(selector, atributos, esTitulo ? title : description),
      ] as const
    })

    return () => {
      document.title = tituloAnterior
      for (const [selector, atributos, valor] of anteriores) ponerMeta(selector, atributos, valor)
    }
  }, [title, description])
}
