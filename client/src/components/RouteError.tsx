import { useEffect } from "react";
import { useRouteError } from "react-router";
import { CircleAlert, RotateCw } from "lucide-react";

import { reportError } from "../monitoring";
import { Button } from "@/components/ui/button";

// a page that failed to render: reported to the error monitoring, and the visitor gets
// a way out instead of React Router's developer screen
const RouteError = () => {
  const error = useRouteError();

  useEffect(() => reportError(error), [error]);

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-16">
      <div
        role="alert"
        className="flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center shadow-sm"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <CircleAlert className="size-6 text-destructive" aria-hidden />
        </span>
        <div className="grid gap-1">
          <p className="font-medium">Something went wrong</p>
          <p className="text-sm text-muted-foreground">
            The error has been reported. Please reload the page.
          </p>
        </div>
        <Button variant="brand" onClick={() => window.location.reload()}>
          <RotateCw />
          Reload the page
        </Button>
      </div>
    </div>
  );
};

export default RouteError;
