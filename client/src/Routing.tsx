import { useRoutes } from "react-router";

import "App.css";
import { SubMainNavigation } from "components/Navigation";
import { HomePage } from "pages/homePage";
import {
  SubscribersPage,
  StatusSubscribersPage,
  CreateSubscriberPage,
  DetailsSubscriberPage,
  UpdateSubscriberPage,
} from "pages/subscribers";
import {
  UpdateEmailsPage,
  CreateEmailPage,
  EmailsPage,
  StatusEmailsPage,
} from "pages/campaigns";
import { NotFoundPage } from "pages/notFoundPage";
const Routing = () => {
  const routes = [
    { path: "/", element: <HomePage /> },

    {
      path: "subscribers",
      element: <SubMainNavigation />,
      children: [
        {
          // the list at /subscribers or /campaigns
          index: true,
          element: <SubscribersPage />,
        },
        {
          path: "status",
          element: <StatusSubscribersPage />,
        },
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
      element: <SubMainNavigation />,
      children: [
        {
          // the list at /subscribers or /campaigns
          index: true,
          element: <EmailsPage />,
        },
        {
          path: "status",
          element: <StatusEmailsPage />,
        },
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
