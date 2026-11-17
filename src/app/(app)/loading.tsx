import { Skeleton } from "@/ui/primitives/skeleton";

export default function AppLoading() {
  return (
    <div className="flex flex-col gap-6" aria-busy>
      <span className="sr-only">Loading</span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-72 w-full" />
    </div>
  );
}
