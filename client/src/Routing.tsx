import { lazy, Suspense } from "react";
import { Navigate, RouteObject, useParams } from "react-router";

import "App.css";
import { SectionLayout } from "components/Navigation";
import { NotFoundPage } from "pages/notFoundPage";

// the candidates and job offers pages are loaded on demand - the home page does not need them
// (the Suspense boundary is in SectionLayout)
const DashboardPage = lazy(() => import("pages/dashboard/DashboardPage"));
const CandidatesPage = lazy(() => import("pages/candidates/CandidatesPage"));
const JobOffersPage = lazy(() => import("pages/jobOffers/JobOffersPage"));
const CreateJobOfferPage = lazy(() => import("pages/jobOffers/CreateJobOfferPage"));
const UpdateJobOfferPage = lazy(() => import("pages/jobOffers/UpdateJobOfferPage"));
const JobOfferDetailsPage = lazy(() => import("pages/jobOffers/JobOfferDetailsPage"));
const FeedbackPage = lazy(() => import("pages/feedback/FeedbackPage"));

// a candidate is shown, added and edited in a panel over the list now -
// the old addresses still work
const CandidatePanelRedirect = ({ mode }: { mode?: "edit" }) => {
  const { id } = useParams();

  return (
    <Navigate
      to={`/candidates?view=${id}${mode ? `&mode=${mode}` : ""}`}
      replace
    />
  );
};

// the pages inside the logged-in layout (see AppContainer)
export const appRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SectionLayout />,
    children: [{ index: true, element: <DashboardPage /> }],
  },

  {
    path: "candidates",
    element: <SectionLayout />,
    children: [
      { index: true, element: <CandidatesPage /> },
      // the status filter is on the list now
      { path: "status", element: <Navigate to="/candidates" replace /> },
      { path: "add", element: <Navigate to="/candidates?mode=new" replace /> },
      { path: "details/:id", element: <CandidatePanelRedirect /> },
      { path: "edit/:id", element: <CandidatePanelRedirect mode="edit" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  {
    path: "job-offers",
    element: <SectionLayout />,
    children: [
      { index: true, element: <JobOffersPage /> },
      { path: "status", element: <Navigate to="/job-offers" replace /> },
      { path: "add", element: <CreateJobOfferPage /> },
      { path: "edit/:id", element: <UpdateJobOfferPage /> },
      // a sent job offer: who got it and every e-mail
      { path: ":id", element: <JobOfferDetailsPage /> },
    ],
  },

  // the addresses from before the rename to Talent Outreach
  { path: "subscribers/*", element: <Navigate to="/candidates" replace /> },
  { path: "campaigns/*", element: <Navigate to="/job-offers" replace /> },

  // what the reviewers of the project think
  {
    path: "feedback",
    element: <SectionLayout />,
    children: [{ index: true, element: <FeedbackPage /> }],
  },
  { path: "*", element: <NotFoundPage /> },
];

// public pages - outside the login (the link in every e-mail)
const OptOutPage = lazy(() => import("pages/optOut/OptOutPage"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/opt-out/:token",
    element: (
      <Suspense fallback={null}>
        <OptOutPage />
      </Suspense>
    ),
  },
];
