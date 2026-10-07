import { lazy } from "react";
import { Navigate, useRoutes } from "react-router";

import "App.css";
import { SectionLayout } from "components/Navigation";
import { DashboardPage } from "pages/dashboard";
import { NotFoundPage } from "pages/notFoundPage";

// the subscribers and campaigns pages are loaded on demand - the home page does not need them
// (the Suspense boundary is in SectionLayout)
const SubscribersPage = lazy(() => import("pages/subscribers/SubscribersPage"));
const CreateSubscriberPage = lazy(() => import("pages/subscribers/CreateSubscriberPage"));
const DetailsSubscriberPage = lazy(() => import("pages/subscribers/DetailsSubscriberPage"));
const UpdateSubscriberPage = lazy(() => import("pages/subscribers/UpdateSubscriberPage"));
const EmailsPage = lazy(() => import("pages/campaigns/EmailsPage"));
const CreateEmailPage = lazy(() => import("pages/campaigns/CreateEmailPage"));
const UpdateEmailsPage = lazy(() => import("pages/campaigns/UpdateEmailsPage"));

const Routing = () => {
  const routes = [
    { path: "/", element: <DashboardPage /> },

    {
      path: "subscribers",
      element: <SectionLayout />,
      children: [
        {
          // the list at /subscribers or /campaigns
          index: true,
          element: <SubscribersPage />,
        },
        // the status filter is on the list now - old links still work
        { path: "status", element: <Navigate to="/subscribers" replace /> },
        {
          path: "add",
          element: <CreateSubscriberPage />,
        },
        {
          path: "details/:id",
          element: <DetailsSubscriberPage />,
        },
        {
          path: "edit/:id",
          element: <UpdateSubscriberPage />,
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },

    {
      path: "campaigns",
      element: <SectionLayout />,
      children: [
        {
          // the list at /subscribers or /campaigns
          index: true,
          element: <EmailsPage />,
        },
        { path: "status", element: <Navigate to="/campaigns" replace /> },
        {
          path: "add",
          element: <CreateEmailPage />,
        },
        {
          path: "edit/:id",
          element: <UpdateEmailsPage />,
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ];

  const routing = useRoutes(routes);

  return <div className="flex flex-1 flex-col">{routing}</div>;
};

export default Routing;
