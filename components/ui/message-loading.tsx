import { cn } from "@/lib/utils";

export function MessageLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}