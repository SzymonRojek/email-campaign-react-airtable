import { useRoutes } from "react-router-dom";

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
import { Campaign, Subscriber } from "types";

interface RoutingProps {
  handleEditSubscriber: (subscriber: Subscriber) => void;
  handleSubscriberDetails: (subscriber: Subscriber) => void;
  handleEditCampaign: (campaign: Campaign) => void;
}

const Routing = ({
  handleEditSubscriber,
  handleSubscriberDetails,
  handleEditCampaign,
}: RoutingProps) => {

  const routes = [
    { path: "/", element: <HomePage /> },

    {
      path: "subscribers",
      element: <SubMainNavigation />,
      children: [
        {
          // the list at /subscribers or /campaigns
          index: true,
          element: (
            <SubscribersPage
              editSubscriber={handleEditSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
            />
          ),
        },
        {
          path: "status",
          element: (
            <StatusSubscribersPage
              editSubscriber={handleEditSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
            />
          ),
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
          element: <EmailsPage editCampaign={handleEditCampaign} />,
        },
        {
          path: "status",
          element: <StatusEmailsPage editCampaign={handleEditCampaign} />,
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
