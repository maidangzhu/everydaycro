export function SectionHead({
  title,
  sub,
  action,
}: {
  title: string
  sub?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <div>
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {sub ? <p className="text-sm text-muted-foreground">{sub}</p> : null}
      </div>
      {action}
    </div>
  )
}
