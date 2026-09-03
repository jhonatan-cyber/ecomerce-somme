import * as React from 'react'

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Init perezoso: evita el setState síncrono en el efecto (cascada de
  // renders) y el parpadeo inicial. El efecto solo suscribe cambios.
  // Duplicado de hooks/use-mobile.ts (shadcn): consolidar en uno solo.
  const [isMobile, setIsMobile] = React.useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  )

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return isMobile
}
