import { LoaderCircle } from "lucide-react";

interface LoaderProps {
  title?: string;
}

const Loader = ({ title = "loading" }: LoaderProps) => (
  <div
    role="status"
    className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-white"
  >
    <LoaderCircle className="size-10 animate-spin text-brand" aria-hidden />
    <p className="text-sm tracking-wider uppercase">{title}</p>
  </div>
);

export default Loader;
