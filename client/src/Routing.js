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

const Routing = (props) => {
  const {
    handleEditSubscriber,
    handleSubscriberDetails,
    handleRemoveItem,
    handleEditCampaign,
  } = props;

  const routes = [
    { path: "/", element: <HomePage /> },

    {
      path: "subscribers",
      element: <SubMainNavigation />,
      children: [
        {
          path: "/",
          element: (
            <SubscribersPage
              editSubscriber={handleEditSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={handleRemoveItem}
            />
          ),
        },
        {
          path: "status",
          element: (
            <StatusSubscribersPage
              editSubscriber={handleEditSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={handleRemoveItem}
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
          path: "/",
          element: (
            <EmailsPage
              editCampaign={handleEditCampaign}
              removeCampaign={handleRemoveItem}
            />
          ),
        },
        {
          path: "status",
          element: (
            <StatusEmailsPage
              editCampaign={handleEditCampaign}
              removeCampaign={handleRemoveItem}
            />
          ),
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

  return <div className="routing-container">{routing}</div>;
};

export default Routing;
