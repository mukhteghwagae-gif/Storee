import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium tracking-wide transition-[opacity,transform,background-color,color,border-color] duration-150 ease-out active:not-disabled:scale-[0.96] disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ivory",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald text-ivory hover:bg-emerald-deep",
        gold: "bg-gold text-ink hover:bg-gold-deep hover:text-ivory",
        outline:
          "border border-ink/20 bg-transparent text-ink hover:border-ink/50 hover:bg-ivory-deep",
        ghost: "text-ink hover:bg-ivory-deep",
        ink: "bg-ink text-ivory hover:bg-ink-soft",
        link: "text-emerald underline-offset-4 hover:underline px-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-xs rounded-md",
        md: "h-11 px-5 text-sm rounded-lg",
        lg: "h-12 px-6 text-sm rounded-lg",
        icon: "size-11 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
