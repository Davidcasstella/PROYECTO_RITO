import { createBrowserRouter, redirect } from 'react-router'
import { RootLayout } from '@/components/layout/RootLayout'

/**
 * Cada opción del menú principal es una página con su propia URL, su propio título y su
 * propia descripción; no hay anclas que desplacen dentro de un único documento largo.
 * Cada página se carga por separado (code splitting): la primera visita descarga menos código.
 */
export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      {
        index: true,
        lazy: async () => ({ Component: (await import('@/pages/home/HomePage')).HomePage }),
      },
      {
        path: 'menu',
        lazy: async () => ({ Component: (await import('@/pages/menu/MenuPage')).MenuPage }),
      },
      {
        path: 'nosotros',
        lazy: async () => ({ Component: (await import('@/pages/about/AboutPage')).AboutPage }),
      },
      {
        path: 'galeria',
        lazy: async () => ({
          Component: (await import('@/pages/galeria/GaleriaPage')).GaleriaPage,
        }),
      },
      {
        path: 'contacto',
        lazy: async () => ({
          Component: (await import('@/pages/contacto/ContactoPage')).ContactoPage,
        }),
      },
      {
        path: 'reservas',
        lazy: async () => ({
          Component: (await import('@/pages/reservas/ReservasPage')).ReservasPage,
        }),
      },
      // Alias cómodos: /carta y /rooftop llevan a sus páginas.
      { path: 'carta', loader: () => redirect('/menu') },
      { path: 'rooftop', loader: () => redirect('/nosotros') },
      {
        path: '*',
        lazy: async () => ({
          Component: (await import('@/pages/not-found/NotFoundPage')).NotFoundPage,
        }),
      },
    ],
  },
])
