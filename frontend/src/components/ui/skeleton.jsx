import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gradient-to-r from-accent via-accent/50 to-accent rounded-lg animate-shimmer bg-[length:200%_100%]",
        className
      )}
      {...props} />
  );
}

export { Skeleton }
