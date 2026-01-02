import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-[var(--bg-tertiary)] rounded",
        className
      )}
    />
  );
}

export function PostCardSkeleton() {
  return (
    <div className="p-6 border-b border-[var(--border)]">
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="pt-4 border-t border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex gap-4">
              <Skeleton className="w-12 h-6" />
              <Skeleton className="w-12 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
