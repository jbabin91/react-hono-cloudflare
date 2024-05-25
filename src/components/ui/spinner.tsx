import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const spinnerVariants = cva('animate-spin text-slate-600 dark:text-white', {
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      lg: 'size-16',
      md: 'size-8',
      sm: 'size-4',
      xl: 'size-24',
    },
  },
});

export type SpinnerProps = React.HTMLAttributes<SVGAElement> &
  VariantProps<typeof spinnerVariants>;

export function Spinner({ size, className }: SpinnerProps) {
  return (
    <>
      <svg
        className={cn(spinnerVariants({ className, size }))}
        fill="none"
        height="24"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
      </svg>
      <span className="sr-only">Loading</span>
    </>
  );
}
