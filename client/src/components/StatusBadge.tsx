import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusClassName: Record<string, string> = {
  active: "bg-emerald-600 text-white",
  sent: "bg-emerald-600 text-white",
  pending: "bg-amber-500 text-white",
  draft: "bg-amber-500 text-white",
  blocked: "bg-red-600 text-white",
};

const StatusBadge = ({ status }: { status: string }) => (
  <Badge
    className={cn(
      "min-w-20 justify-center tracking-wider uppercase",
      statusClassName[status] ?? "bg-muted text-muted-foreground"
    )}
  >
    {status}
  </Badge>
);

export default StatusBadge;
