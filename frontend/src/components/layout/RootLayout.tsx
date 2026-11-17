import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { BarraProgreso } from '@/components/layout/BarraProgreso'
import { Loader } from '@/components/layout/Loader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TelonRuta } from '@/components/layout/TelonRuta'
import { marcarEntradaLista } from '@/lib/entrada'
import { ScrollTrigger } from '@/lib/gsap'

/**
 * La entrada al restaurante es la bienvenida al sitio, no una cortina entre pestañas:
 * se muestra una sola vez por visita y solo si se llega directamente a Inicio.
 */
let entradaYaVista = false

/** Armazón común a todas las rutas: pantalla de carga, cabecera, contenido y pie. */
export function RootLayout() {
  const location = useLocation()
  const [cargando, setCargando] = useState(() => !entradaYaVista && location.pathname === '/')

  const terminarCarga = useCallback(() => {
    entradaYaVista = true
    setCargando(false)
  }, [])

  // Quien entra por otra página no ve la pantalla de carga, pero tampoco debe verla luego.
  useEffect(() => {
    if (location.pathname !== '/') entradaYaVista = true
  }, [location.pathname])

  // Mientras está la pantalla de carga, la página de debajo no se mueve.
  useEffect(() => {
    document.body.style.overflow = cargando ? 'hidden' : ''
    if (!cargando) {
      ScrollTrigger.refresh()
      marcarEntradaLista()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [cargando])

  // Cada página empieza arriba; si trae ancla, el navegador ya la resuelve con scroll-padding.
  useEffect(() => {
    if (location.hash) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    ScrollTrigger.refresh()
  }, [location.pathname, location.hash])

  return (
    <>
      {cargando ? <Loader onTerminar={terminarCarga} /> : null}

      <a href="#contenido" className="skip-link">
        Saltar al contenido
      </a>

      <BarraProgreso />
      <SiteHeader />
      <TelonRuta />

      {/* La clave reinicia la transición en cada ruta: un fundido corto y discreto. */}
      <main
        id="contenido"
        key={location.pathname}
        className="animate-[pagina_600ms_ease-out_250ms_both] motion-reduce:animate-none"
      >
        <Outlet />
      </main>

      <SiteFooter />
    </>
  )
}
