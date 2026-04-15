interface PromoBannerProps {
  title: string
  subtitle: string
  accent: string
}

export function PromoBanner({ title, subtitle, accent }: PromoBannerProps) {
  return (
    <article className="overflow-hidden rounded-[1.6rem] border border-border/70 bg-card p-5 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-primary">{subtitle}</p>
      <h3 className="mt-3 text-xl font-black leading-tight text-foreground">{title}</h3>
      <div className={`mt-5 h-1.5 w-16 rounded-full ${accent}`} />
    </article>
  )
}
