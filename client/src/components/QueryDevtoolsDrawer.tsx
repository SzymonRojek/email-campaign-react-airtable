import { lazy, Suspense, useEffect } from "react";

import { useTheme } from "contexts/ThemeContext";

// loaded only when opened - and the package renders nothing in a production build
const ReactQueryDevtoolsPanel = lazy(() =>
  import("@tanstack/react-query-devtools").then((module) => ({
    default: module.ReactQueryDevtoolsPanel,
  }))
);

interface QueryDevtoolsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// TanStack Query devtools as a drawer at the bottom (development only) -
// opened from the sidebar instead of the library's floating button
const QueryDevtoolsDrawer = ({ isOpen, onClose }: QueryDevtoolsDrawerProps) => {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="region"
      aria-label="Query devtools"
      className="fixed inset-x-0 bottom-0 z-50 h-[45vh] overflow-hidden border-t bg-card shadow-2xl md:left-60"
    >
      <Suspense fallback={null}>
        <ReactQueryDevtoolsPanel
          style={{ height: "100%" }}
          theme={resolvedTheme}
          onClose={onClose}
        />
      </Suspense>
    </div>
  );
};

export default QueryDevtoolsDrawer;
