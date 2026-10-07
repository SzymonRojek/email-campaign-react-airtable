import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  // the accessible name, e.g. "Search subscribers"
  label: string;
  placeholder: string;
  className?: string;
}

const SearchInput = ({ value, onChange, label, placeholder, className }: SearchInputProps) => (
  <div className={cn("relative", className)}>
    <Search
      className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      aria-hidden
    />
    <Input
      type="search"
      aria-label={label}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => event.key === "Escape" && onChange("")}
      className="h-9 pr-8 pl-8 [&::-webkit-search-cancel-button]:hidden"
    />
    {value && (
      <button
        type="button"
        aria-label="Clear the search"
        onClick={() => onChange("")}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-sm p-0.5 text-muted-foreground hover:text-foreground"
      >
        <X className="size-3.5" />
      </button>
    )}
  </div>
);

export default SearchInput;
