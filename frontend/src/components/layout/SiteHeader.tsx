import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router'
import { Logo } from '@/components/layout/Logo'
import { ButtonLink } from '@/components/ui/ButtonLink'
import { Container } from '@/components/ui/Container'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/cn'

/**
 * Cabecera fija, igual en todas las páginas.
 *
 * Empieza transparente sobre la portada y, al bajar, se vuelve una barra sólida y discreta.
 * El enlace de la página en la que estás queda marcado. En móvil el menú se abre en un
 * `<dialog>` a pantalla completa: el navegador ya se encarga de cerrarlo con Escape, de
 * mantener el foco dentro y de devolverlo al botón al cerrar.
 */
export function SiteHeader() {
  const [compacto, setCompacto] = useState(false)
  const [menuAbierto, setMenuAbierto] = useState(false)
  const menuRef = useRef<HTMLDialogElement>(null)
  /** Ruta a la que ir en cuanto el menú móvil termine de cerrarse. */
  const pendienteRef = useRef<string | null>(null)
  const location = useLocation()
  const navigate = useNavigate()

  // En la portada la cabecera flota sobre la secuencia; en el resto siempre es sólida.
  const enPortada = location.pathname === '/'
  const solida = compacto || !enPortada

  useEffect(() => {
    const alHacerScroll = () => setCompacto(window.scrollY > 80)
    alHacerScroll()
    window.addEventListener('scroll', alHacerScroll, { passive: true })
    return () => window.removeEventListener('scroll', alHacerScroll)
  }, [])

  useEffect(() => {
    const dialog = menuRef.current
    if (!dialog) return
    if (menuAbierto && !dialog.open) dialog.showModal()
    if (!menuAbierto && dialog.open) dialog.close()
  }, [menuAbierto])

  /**
   * Un `<dialog>` abierto en modo modal deja inerte el resto de la página, así que primero
   * se cierra el menú y la navegación se hace cuando el navegador avisa (evento `close`).
   */
  function irA(href: string) {
    pendienteRef.current = href
    const dialog = menuRef.current
    if (dialog?.open) {
      // Cerrar de inmediato evita que una actualización de estado retrasada deje la
      // navegación pendiente en conexiones o dispositivos más lentos.
      dialog.close()
    } else {
      pendienteRef.current = null
      void navigate(href)
    }
    setMenuAbierto(false)
  }

  function alCerrarMenu() {
    setMenuAbierto(false)
    const href = pendienteRef.current
    pendienteRef.current = null
    if (href) void navigate(href)
  }

  const claseEnlace = ({ isActive }: { isActive: boolean }) =>
    cn(
      'relative inline-flex min-h-11 items-center text-eyebrow uppercase transition-colors duration-300 ease-luxe',
      'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber',
      "after:absolute after:inset-x-0 after:bottom-2 after:h-px after:origin-left after:bg-accent after:transition-transform after:duration-300 after:content-['']",
      isActive
        ? 'text-foreground after:scale-x-100'
        : 'text-foreground/80 after:scale-x-0 hover:text-foreground hover:after:scale-x-100',
    )

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-luxe',
          solida
            ? 'bg-background/92 shadow-lg shadow-black/20 backdrop-blur-md'
            : 'bg-linear-to-b from-background/55 to-transparent',
        )}
      >
        <Container
          className={cn(
            'flex items-center justify-between gap-6 transition-[padding] duration-500 ease-luxe',
            compacto ? 'py-3' : 'py-5',
          )}
        >
          <NavLink
            to="/"
            className="rounded-xs text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
          >
            <Logo tamano={compacto ? 'sm' : 'md'} />
            <span className="sr-only">Ir al inicio</span>
          </NavLink>

          <nav aria-label="Principal" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <NavLink to={item.href} end={item.href === '/'} className={claseEnlace}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <ButtonLink
              to={siteConfig.reservasHref}
              variant="outline"
              className="hidden sm:inline-flex"
            >
              Reservar mesa
            </ButtonLink>

            <button
              type="button"
              onClick={() => setMenuAbierto(true)}
              aria-expanded={menuAbierto}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xs text-foreground transition-colors duration-300 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber lg:hidden"
            >
              <Menu aria-hidden="true" className="size-6" />
              <span className="sr-only">Abrir el menú</span>
            </button>
          </div>
        </Container>
      </header>

      <dialog
        ref={menuRef}
        onClose={alCerrarMenu}
        aria-label="Menú de navegación"
        className="h-full max-h-none w-full max-w-none bg-background text-foreground backdrop:bg-background/80"
      >
        <div className="flex h-full flex-col">
          <Container className="flex items-center justify-between py-5">
            <Logo tamano="sm" />
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              className="inline-flex size-11 cursor-pointer items-center justify-center rounded-xs transition-colors duration-300 hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber"
            >
              <X aria-hidden="true" className="size-6" />
              <span className="sr-only">Cerrar el menú</span>
            </button>
          </Container>

          <Container className="flex flex-1 flex-col justify-center gap-1 pb-16">
            {siteConfig.nav.map((item) => {
              const activo =
                item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={activo ? 'page' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    irA(item.href)
                  }}
                  className={cn(
                    'flex items-center justify-between border-b border-border py-5 font-display text-h3 transition-colors duration-300',
                    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber',
                    activo ? 'text-amber' : 'hover:text-amber',
                  )}
                >
                  {item.label}
                  {activo ? <span aria-hidden="true" className="h-px w-8 bg-accent" /> : null}
                </a>
              )
            })}

            <a
              href={siteConfig.reservasHref}
              onClick={(event) => {
                event.preventDefault()
                irA(siteConfig.reservasHref)
              }}
              className="mt-8 inline-flex min-h-11 cursor-pointer items-center justify-center self-start rounded-xs bg-accent px-9 py-4 text-[0.72rem] font-semibold tracking-[0.2em] text-accent-foreground uppercase transition-colors duration-300 hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber"
            >
              Reservar mesa
            </a>
          </Container>
        </div>
      </dialog>
    </>
  )
}
