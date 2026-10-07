import { Link } from "react-router";
import { CircleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: string;
}

const Error = ({ error }: ErrorProps) => (
  <div className="flex flex-1 items-center justify-center px-4 py-16">
    <div
      role="alert"
      className="flex max-w-md flex-col items-center gap-4 rounded-xl border bg-card p-8 text-center shadow-sm"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
        <CircleAlert className="size-6 text-destructive" aria-hidden />
      </span>
      <p className="font-medium">{error}</p>
      <Button asChild variant="outline">
        <Link to="/">Back to the dashboard</Link>
      </Button>
    </div>
  </div>
);

export default Error;
