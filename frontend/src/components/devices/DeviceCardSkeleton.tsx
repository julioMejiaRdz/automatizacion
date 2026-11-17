import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const pulse = 'motion-reduce:animate-none'

/** Esqueleto con la misma forma que DeviceCard, para que no haya salto al llegar los datos. */
export default function DeviceCardSkeleton() {
  return (
    <Card aria-hidden="true">
      <CardHeader className="gap-2">
        <Skeleton className={`h-5 w-1/2 ${pulse}`} />
        <Skeleton className={`h-4 w-2/3 ${pulse}`} />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="space-y-2 rounded-lg border p-3">
              <Skeleton className={`h-3 w-3/5 ${pulse}`} />
              <Skeleton className={`h-6 w-4/5 ${pulse}`} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
