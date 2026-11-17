import { RouterProvider } from 'react-router/dom'
import { MotionProvider } from '@/app/MotionProvider'
import { router } from '@/app/router'
import { SmoothScrollProvider } from '@/app/SmoothScrollProvider'

export function App() {
  return (
    <MotionProvider>
      <SmoothScrollProvider>
        <RouterProvider router={router} />
      </SmoothScrollProvider>
    </MotionProvider>
  )
}
