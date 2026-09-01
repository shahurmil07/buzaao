import { useState } from 'react'
import type { FaqItem } from '../types'
import { cn } from '../lib/cn'

interface FaqAccordionProps {
  title: string
  items: FaqItem[]
}

export function FaqAccordion({ title, items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const titleId = `faq-${title.replace(/\s+/g, '-').toLowerCase()}`

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="mt-10 w-full animate-fade-up max-sm:mt-6" aria-labelledby={titleId}>
      <h2
        id={titleId}
        className="mb-4 font-display text-[clamp(1.25rem,3vw,1.5rem)] font-extrabold tracking-[-0.02em] text-ink max-sm:mb-[0.65rem] max-sm:text-[0.95rem]"
      >
        {title}
      </h2>

      <div className="flex flex-col gap-[0.65rem] max-sm:gap-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index
          const panelId = `${titleId}-${index}`

          return (
            <div
              key={item.question}
              className={cn(
                'overflow-hidden rounded-xl border border-line bg-white transition-[box-shadow,border-color] duration-280 ease-smooth',
                isOpen &&
                  'border-[color-mix(in_srgb,var(--color-brand)_25%,var(--color-line))] shadow-[0_4px_16px_rgba(17,17,17,0.06)]',
              )}
            >
              <h3 className="m-0">
                <button
                  type="button"
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-[1.15rem] py-4 text-left transition-colors duration-180 ease-smooth hover:bg-page max-sm:px-[0.8rem] max-sm:py-3',
                    isOpen && 'bg-[color-mix(in_srgb,var(--color-brand)_4%,#fff)]',
                  )}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => toggle(index)}
                >
                  <span className="font-display text-[0.95rem] font-bold leading-snug text-ink max-sm:text-[0.8rem]">
                    {item.question}
                  </span>
                  <span
                    className={cn(
                      'inline-flex size-7 shrink-0 origin-center items-center justify-center rounded-full bg-page leading-none text-brand transition-[transform,background-color] duration-280 ease-smooth max-sm:size-6',
                      isOpen && 'rotate-45 bg-[color-mix(in_srgb,var(--color-brand)_12%,#fff)]',
                    )}
                    aria-hidden="true"
                  >
                    <svg
                      className="block shrink-0 text-brand max-sm:size-2.5"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 1.25v9.5M1.25 6h9.5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                className={cn(
                  'grid transition-[grid-template-rows] duration-280 ease-smooth',
                  isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                )}
                role="region"
                aria-hidden={!isOpen}
              >
                <div className="overflow-hidden">
                  <p
                    className={cn(
                      'm-0 px-[1.15rem] pb-4 pt-[0.15rem] text-[0.92rem] leading-[1.65] text-muted transition-[opacity,transform] duration-280 ease-smooth max-sm:px-[0.8rem] max-sm:pb-3 max-sm:pt-[0.1rem] max-sm:text-[0.76rem] max-sm:leading-[1.55]',
                      isOpen ? 'translate-y-0 opacity-100' : '-translate-y-1.5 opacity-0',
                    )}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
