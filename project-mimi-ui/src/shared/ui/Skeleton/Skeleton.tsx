import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-800/80",
      className
    )}
  />
);