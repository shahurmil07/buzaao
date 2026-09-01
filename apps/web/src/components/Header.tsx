import iconImg from '../assets/buzaao-icon-transparent.png'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white shadow-[0_1px_0_rgba(17,17,17,0.04)]">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-3 max-sm:px-[0.85rem] max-sm:py-2.5">
        <a
          href="/"
          className="inline-flex items-center gap-2.5 text-inherit no-underline max-sm:gap-2 group"
          aria-label="Buzaao — Subscription Billing"
        >
          <span className="flex size-[38px] shrink-0 items-center justify-center max-sm:size-[30px]">
            <img
              src={iconImg}
              alt=""
              className="block size-[38px] object-contain max-sm:size-[30px]"
              aria-hidden="true"
            />
          </span>
          <span className="flex flex-col gap-px leading-tight">
            <span className="font-display text-[1.15rem] font-extrabold tracking-[0.06em] text-ink transition-colors duration-150 group-hover:text-brand max-sm:text-[0.9rem]">
              BUZAAO
            </span>
            <span className="text-[0.72rem] font-medium tracking-[0.01em] text-slate-500 max-sm:text-[0.62rem]">
              Subscription Billing
            </span>
          </span>
        </a>
      </div>
    </header>
  )
}
