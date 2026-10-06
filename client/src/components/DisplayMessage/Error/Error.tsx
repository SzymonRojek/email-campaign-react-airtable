import { CircleAlert } from "lucide-react";

interface ErrorProps {
  error: string;
}

const Error = ({ error }: ErrorProps) => (
  <div
    role="alert"
    className="mx-auto mt-16 flex max-w-md items-center gap-3 rounded-xl bg-white p-6 shadow-lg"
  >
    <CircleAlert className="size-6 shrink-0 text-destructive" aria-hidden />
    <p className="text-base font-medium text-destructive">{error}</p>
  </div>
);

export default Error;
