import { useEffect, useState } from 'react'

/** Hora actual (ms) que se actualiza cada `intervalMs`: para recalcular estados que dependen del tiempo. */
export function useNow(intervalMs = 5000) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), intervalMs)
    return () => clearInterval(timer)
  }, [intervalMs])

  return now
}
