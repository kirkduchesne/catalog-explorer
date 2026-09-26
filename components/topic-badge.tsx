import { cn } from '@/lib/utils';

const tones: Record<string, string> = {
  HTML: 'bg-orange-100 text-orange-900 ring-orange-300/70 dark:bg-orange-400/10 dark:text-orange-200 dark:ring-orange-400/30',
  CSS: 'bg-sky-100 text-sky-900 ring-sky-300/70 dark:bg-sky-400/10 dark:text-sky-200 dark:ring-sky-400/30',
  JavaScript:
    'bg-amber-100 text-amber-900 ring-amber-300/70 dark:bg-amber-300/10 dark:text-amber-200 dark:ring-amber-300/30',
  Python:
    'bg-emerald-100 text-emerald-900 ring-emerald-300/70 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-400/30',
};

const dots: Record<string, string> = {
  HTML: 'bg-orange-500',
  CSS: 'bg-sky-500',
  JavaScript: 'bg-amber-500',
  Python: 'bg-emerald-500',
};

export function topicDot(topic: string) {
  return dots[topic] ?? 'bg-muted-foreground';
}

export function TopicBadge({
  topic,
  className,
}: {
  topic: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium ring-1 ring-inset',
        tones[topic] ?? 'bg-muted text-muted-foreground ring-border',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', topicDot(topic))}
      />
      {topic}
    </span>
  );
}

export function LevelBadge({ level }: { level: string }) {
  const steps = level === 'Beginner' ? 1 : 2;
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
      <span aria-hidden="true" className="flex items-end gap-0.5">
        {[1, 2, 3].map((step) => (
          <span
            key={step}
            className={cn(
              'w-[3px] rounded-sm',
              step === 1 ? 'h-1.5' : step === 2 ? 'h-2.5' : 'h-3.5',
              step <= steps ? 'bg-foreground/70' : 'bg-foreground/15',
            )}
          />
        ))}
      </span>
      {level}
    </span>
  );
}
