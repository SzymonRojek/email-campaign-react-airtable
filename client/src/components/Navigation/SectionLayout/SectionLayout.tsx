import { Suspense } from "react";
import { Outlet } from "react-router";

import { Loader } from "components/DisplayMessage";

// the subscribers / campaigns pages - lazy-loaded (see Routing)
const SectionLayout = () => (
  <Suspense fallback={<Loader />}>
    <Outlet />
  </Suspense>
);

export default SectionLayout;
