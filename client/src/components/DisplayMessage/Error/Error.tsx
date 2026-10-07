import { Link, useLocation } from "react-router";
import { CircleAlert, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: string;
  // e.g. load the data again - shows a "Try again" button
  onRetry?: () => void;
  // the data is being loaded again
  isRetrying?: boolean;
}

const Error = ({ error, onRetry, isRetrying = false }: ErrorProps) => {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <div
        role="alert"
        className="flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center shadow-sm"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <CircleAlert className="size-6 text-destructive" aria-hidden />
        </span>
        <p className="font-medium">{error}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {onRetry && (
            <Button variant="brand" onClick={onRetry} disabled={isRetrying}>
              <RotateCw className={isRetrying ? "animate-spin" : undefined} />
              {isRetrying ? "Trying..." : "Try again"}
            </Button>
          )}
          {/* no link to the page the user is already on */}
          {pathname !== "/" && (
            <Button asChild variant="outline">
              <Link to="/">Back to the dashboard</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Error;
