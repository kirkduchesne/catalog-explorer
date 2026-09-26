import { cn } from '@/lib/utils';

// A page with its top-right corner folded down: the Dogear mark.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={cn('size-8 shrink-0', className)}
    >
      <path
        d="M7 3h13l9 9v14a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"
        className="fill-primary"
      />
      <path d="M20 3v6a3 3 0 0 0 3 3h6Z" className="fill-brand" />
      <path
        d="M9.5 17h11M9.5 21.5h7"
        className="stroke-primary-foreground"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2.5 font-serif text-[1.35rem] font-semibold tracking-tight text-foreground',
        className,
      )}
    >
      <LogoMark />
      <span>
        Dogear<span className="text-brand">.</span>
      </span>
    </span>
  );
}
