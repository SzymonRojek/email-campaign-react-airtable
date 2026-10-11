import { Suspense } from "react";
import { Outlet } from "react-router";

import { Loader } from "components/DisplayMessage";

// the candidates / job offers pages - lazy-loaded (see Routing)
const SectionLayout = () => (
  <Suspense fallback={<Loader />}>
    <Outlet />
  </Suspense>
);

export default SectionLayout;
