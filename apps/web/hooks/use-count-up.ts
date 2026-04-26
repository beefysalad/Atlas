import { useEffect, useRef, useState } from "react"

interface UseCountUpOptions {
  end: number
  duration?: number
  decimals?: number
  startOnMount?: boolean
}

export function useCountUp({
  end,
  duration = 1800,
  decimals = 0,
  startOnMount = false,
}: UseCountUpOptions) {
  const [value, setValue] = useState(startOnMount ? 0 : end)
  const started = useRef(startOnMount)
  const rafRef = useRef<number | null>(null)

  function start() {
    if (started.current) return
    started.current = true

    const startTime = performance.now()
    const startValue = 0

    function tick(now: number) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (end - startValue) * eased
      setValue(parseFloat(current.toFixed(decimals)))
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setValue(end)
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  useEffect(() => {
    if (startOnMount) start()
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { value, start }
}
