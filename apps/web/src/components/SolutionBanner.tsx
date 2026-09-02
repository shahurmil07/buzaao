interface SolutionBannerProps {
  kicker: string
  headline?: string
  title: string
  subtitle?: string
  note?: string
  whatsappLabel: string
  whatsappUrl: string
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.15 6.43 2.15 11.89c0 1.95.51 3.86 1.48 5.54L2 22l4.7-1.53a9.86 9.86 0 0 0 5.34 1.54h.01c5.46 0 9.89-4.43 9.89-9.89C21.94 6.43 17.5 2 12.04 2zm5.72 14.05c-.24.68-1.4 1.3-1.94 1.34-.5.04-1.12.06-1.81-.11-.42-.11-.95-.31-1.64-.6-2.88-1.25-4.76-4.16-4.9-4.35-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.98-2.35.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.62.48.24.58.8 2 .87 2.14.07.14.12.31.02.5-.1.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.16-.19.69-.81.88-1.08.19-.28.37-.23.62-.14.25.1 1.57.74 1.84.87.27.14.45.2.52.31.07.11.07.64-.17 1.32z" />
    </svg>
  )
}

export function SolutionBanner({
  kicker,
  headline,
  title,
  subtitle,
  note,
  whatsappLabel,
  whatsappUrl,
}: SolutionBannerProps) {
  return (
    <aside className="flex items-center justify-between gap-6 rounded-2xl border-2 border-[color-mix(in_srgb,var(--color-brand)_22%,var(--color-line))] bg-[linear-gradient(105deg,#fff5f5_0%,#fffafa_48%,#fff8f8_100%)] px-6 py-5 shadow-[0_2px_16px_rgba(227,30,36,0.06)] max-lg:flex-col max-lg:items-start max-lg:gap-4 max-sm:px-4 max-sm:py-4">
      <div className="flex min-w-0 flex-1 items-center gap-6 max-md:flex-col max-md:items-start max-md:gap-3">
        <div className="shrink-0">
          <p
            className={
              headline
                ? 'm-0 font-display text-[0.68rem] font-bold tracking-[0.08em] text-muted uppercase'
                : 'm-0 font-display text-[0.78rem] font-extrabold tracking-[0.08em] text-brand uppercase'
            }
          >
            {kicker}
          </p>
          {headline ? (
            <p className="mt-1 mb-0 font-display text-[clamp(1.45rem,2.6vw,1.85rem)] font-extrabold leading-none tracking-[-0.03em] text-brand">
              {headline}
            </p>
          ) : null}
        </div>
        <div className="hidden h-12 w-px shrink-0 bg-line md:block" aria-hidden="true" />
        <div className="min-w-0">
          <h3 className="m-0 font-display text-[1.05rem] font-extrabold tracking-[-0.02em] text-ink max-sm:text-[0.95rem]">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 mb-0 text-[0.85rem] leading-relaxed text-muted max-sm:text-[0.76rem]">{subtitle}</p>
          ) : null}
          {note ? <p className="mt-1.5 mb-0 text-[0.7rem] text-muted">{note}</p> : null}
        </div>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#25D366] px-4 py-[0.7rem] font-display text-[0.82rem] font-bold text-white no-underline shadow-[0_4px_14px_rgba(37,211,102,0.28)] transition-[background,transform] duration-180 ease-smooth hover:bg-[#1ebe5d] active:scale-[0.98] max-sm:w-full"
      >
        <WhatsAppIcon />
        {whatsappLabel}
      </a>
    </aside>
  )
}
