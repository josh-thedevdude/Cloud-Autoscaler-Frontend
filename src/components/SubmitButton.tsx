import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isLoading: boolean;
  label: string;
  className?: string;
}

export default function SubmitButton({ isLoading, label, className }: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={cn(
        "w-full bg-chart-1 text-primary-foreground cursor-pointer",
        isLoading && "opacity-80",
        className
      )}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        label
      )}
    </Button>
  );
};