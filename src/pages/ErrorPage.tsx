import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPageProps {
  title?: string;
  description?: string;
  showReload?: boolean;
  showHome?: boolean;
}

export default function ErrorPage({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  showReload = true,
  showHome = true,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertTriangle className="h-7 w-7 text-destructive" />
      </div>

      <h1 className="text-xl font-semibold text-foreground">
        {title}
      </h1>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>

      <div className="mt-6 flex gap-3">
        {showReload && (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Reload
          </Button>
        )}

        {showHome && (
          <Button
            variant="default"
            onClick={() => (window.location.href = "/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  );
};