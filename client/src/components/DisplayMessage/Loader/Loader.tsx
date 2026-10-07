import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  title?: string;
}

const Loader = ({ title = "Loading..." }: LoaderProps) => (
  <div
    role="status"
    className="flex flex-1 flex-col items-center justify-center gap-3 py-24 text-muted-foreground"
  >
    <LoaderCircle className="size-8 animate-spin text-brand" aria-hidden />
    <p className="text-sm">{title}</p>
  </div>
);

export default Loader;
