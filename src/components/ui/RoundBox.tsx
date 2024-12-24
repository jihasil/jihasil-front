import React from 'react';
import { buttonVariants } from '@/components/ui/button';
import { type VariantProps } from 'class-variance-authority';

export interface DivProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const RoundBox = React.forwardRef<
  HTMLDivElement,
  DivProps
>(({ className, children, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        <div className="flex justify-center items-center rounded-md">
          {children}
        </div>
      </div>
    );
  },
);