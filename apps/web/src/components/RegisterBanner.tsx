interface RegisterBannerProps {
  label: string
  url: string
}

export function RegisterBanner({ label, url }: RegisterBannerProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 flex items-start gap-2 rounded-xl border border-[color-mix(in_srgb,var(--color-brand)_12%,var(--color-line))] bg-[color-mix(in_srgb,var(--color-brand)_5%,#fff)] px-[1.1rem] py-[0.9rem] text-[0.88rem] font-semibold leading-[1.55] text-ink no-underline transition-[background,border-color,transform] duration-180 ease-smooth hover:border-[color-mix(in_srgb,var(--color-brand)_28%,var(--color-line))] hover:bg-[color-mix(in_srgb,var(--color-brand)_8%,#fff)] active:scale-[0.995] max-sm:mt-3 max-sm:px-3 max-sm:py-[0.65rem] max-sm:text-[0.74rem] max-sm:leading-[1.45]"
    >
      <span className="shrink-0 leading-[1.55]" aria-hidden="true">
        ⭐
      </span>
      <span className="min-w-0">
        {label}
        <span className="ml-1.5 text-brand underline-offset-2 group-hover:underline">→</span>
      </span>
    </a>
  )
}
