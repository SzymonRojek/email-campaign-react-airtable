import { useRoutes } from "react-router-dom";

import "App.css";
import { SubMainNavigation } from "components/Navigation";
import { HomePage } from "pages/homePage";
import {
  SubscribersPage,
  StatusSubscribersPage,
  AddSubscriberPage,
  DetailsSubscriberPage,
  EditSubscriberPage,
} from "pages/subscribers";
import {
  EditCampaignPage,
  AddCampaignPage,
  CampaignsPage,
  StatusCampaignsPage,
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
          element: <AddSubscriberPage />,
        },
        {
          path: "details/:id",
          element: <DetailsSubscriberPage />,
        },
        {
          path: "edit/:id",
          element: <EditSubscriberPage />,
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
            <CampaignsPage
              editCampaign={handleEditCampaign}
              removeCampaign={handleRemoveItem}
            />
          ),
        },
        {
          path: "status",
          element: (
            <StatusCampaignsPage
              editCampaign={handleEditCampaign}
              removeCampaign={handleRemoveItem}
            />
          ),
        },
        {
          path: "add",
          element: <AddCampaignPage />,
        },
        {
          path: "edit/:id",
          element: <EditCampaignPage />,
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ];

  const routing = useRoutes(routes);

  return <div className="routing-container">{routing}</div>;
};

export default Routing;
