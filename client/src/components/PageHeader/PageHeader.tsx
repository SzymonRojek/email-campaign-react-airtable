import { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

interface PageHeaderProps {
  title: ReactNode;
  // e.g. "10 subscribers · 7 active"
  description?: ReactNode;
  // the main buttons of the page, on the right
  actions?: ReactNode;
  // a link back to the list on forms and details
  back?: { to: string; label: string };
}

const PageHeader = ({ title, description, actions, back }: PageHeaderProps) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
    <div className="min-w-0">
      {back && (
        <Link
          to={back.to}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" aria-hidden />
          {back.label}
        </Link>
      )}
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
    {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
