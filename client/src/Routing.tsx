import { lazy, Suspense } from "react";
import { Navigate, RouteObject, useParams } from "react-router";

import "App.css";
import { SectionLayout } from "components/Navigation";
import { DashboardPage } from "pages/dashboard";
import { NotFoundPage } from "pages/notFoundPage";

// the subscribers and campaigns pages are loaded on demand - the home page does not need them
// (the Suspense boundary is in SectionLayout)
const SubscribersPage = lazy(() => import("pages/subscribers/SubscribersPage"));
const EmailsPage = lazy(() => import("pages/campaigns/EmailsPage"));
const CreateEmailPage = lazy(() => import("pages/campaigns/CreateEmailPage"));
const UpdateEmailsPage = lazy(() => import("pages/campaigns/UpdateEmailsPage"));
const CampaignDetailsPage = lazy(() => import("pages/campaigns/CampaignDetailsPage"));
const FeedbackPage = lazy(() => import("pages/feedback/FeedbackPage"));

// a subscriber is shown, added and edited in a panel over the list now -
// the old addresses still work
const SubscriberPanelRedirect = ({ mode }: { mode?: "edit" }) => {
  const { id } = useParams();

  return (
    <Navigate
      to={`/subscribers?view=${id}${mode ? `&mode=${mode}` : ""}`}
      replace
    />
  );
};

// the pages inside the logged-in layout (see AppContainer)
export const appRoutes: RouteObject[] = [
  { path: "/", element: <DashboardPage /> },

  {
    path: "subscribers",
    element: <SectionLayout />,
    children: [
      { index: true, element: <SubscribersPage /> },
      // the status filter is on the list now
      { path: "status", element: <Navigate to="/subscribers" replace /> },
      { path: "add", element: <Navigate to="/subscribers?mode=new" replace /> },
      { path: "details/:id", element: <SubscriberPanelRedirect /> },
      { path: "edit/:id", element: <SubscriberPanelRedirect mode="edit" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },

  {
    path: "campaigns",
    element: <SectionLayout />,
    children: [
      { index: true, element: <EmailsPage /> },
      { path: "status", element: <Navigate to="/campaigns" replace /> },
      { path: "add", element: <CreateEmailPage /> },
      { path: "edit/:id", element: <UpdateEmailsPage /> },
      // a sent campaign: who got it and every e-mail
      { path: ":id", element: <CampaignDetailsPage /> },
    ],
  },

  // what the reviewers of the project think
  {
    path: "feedback",
    element: <SectionLayout />,
    children: [{ index: true, element: <FeedbackPage /> }],
  },
  { path: "*", element: <NotFoundPage /> },
];

// public pages - outside the login (the link in every e-mail)
const UnsubscribePage = lazy(() => import("pages/unsubscribe/UnsubscribePage"));

export const publicRoutes: RouteObject[] = [
  {
    path: "/unsubscribe/:token",
    element: (
      <Suspense fallback={null}>
        <UnsubscribePage />
      </Suspense>
    ),
  },
];
