import { useRoutes } from "react-router-dom";

import "App.css";
import { SubNavigation } from "components/Navigation";
import { HomePage } from "pages/homePage";
import {
  SubscribersPage,
  SubscribersStatusPage,
  AddSubscriberPage,
  SubscriberDetailsPage,
} from "pages/subscribers";
import {
  CampaignEditPage,
  AddCampaignPage,
  CampaignsPage,
  CampaignsStatusPage,
} from "pages/campaigns";
import {
  subscribersLinksNavigation,
  campaignsLinksNavigation,
} from "data/dataLinksNavigation";
import { NotFoundPage } from "pages/notFoundPage";
import EditSubscriberPage from "./pages/subscribers/EditSubscriberPage";

const Routing = (props) => {
  const {
    subscribersData,
    handleEditSubscriber,
    handleSubscriberDetails,
    handleRemoveItem,
    getSubscribersData,
    campaignsData,
    handleEditCampaign,
    getCampaignsData,
  } = props;

  const routes = [
    { path: "/", element: <HomePage /> },
    {
      path: "subscribers",
      element: <SubNavigation dataLinks={subscribersLinksNavigation} />,
      children: [
        {
          path: "/",
          element: (
            <SubscribersPage
              subscribersData={subscribersData}
              editSubscriber={handleEditSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={handleRemoveItem}
            />
          ),
        },
        {
          path: "status",
          element: (
            <SubscribersStatusPage
              subscribersData={subscribersData}
              editSubscriber={handleEditSubscriber}
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={handleRemoveItem}
            />
          ),
        },
        {
          path: "add",
          element: (
            <AddSubscriberPage
              subscribersData={subscribersData}
              getSubscribersData={getSubscribersData}
            />
          ),
        },
        {
          path: "/details/:id",
          element: <SubscriberDetailsPage />,
        },
        {
          path: "/edit/:id",
          element: (
            <EditSubscriberPage getSubscribersData={getSubscribersData} />
          ),
        },
        { path: "*", element: <NotFoundPage /> },
      ],
    },
    {
      path: "campaigns",
      element: <SubNavigation dataLinks={campaignsLinksNavigation} />,
      children: [
        {
          path: "/",
          element: (
            <CampaignsPage
              campaignsData={campaignsData}
              editCampaign={handleEditCampaign}
              removeCampaign={handleRemoveItem}
            />
          ),
        },
        {
          path: "status",
          element: (
            <CampaignsStatusPage
              campaignsData={campaignsData}
              editCampaign={handleEditCampaign}
              removeCampaign={handleRemoveItem}
            />
          ),
        },
        {
          path: "add",
          element: (
            <AddCampaignPage
              subscribersData={subscribersData}
              getCampaignsData={getCampaignsData}
            />
          ),
        },
        {
          path: "/edit/:id",
          element: (
            <CampaignEditPage
              subscribersData={subscribersData}
              getCampaignsData={getCampaignsData}
            />
          ),
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ];

  const routing = useRoutes(routes);

  return <div className="routing-container">{routing}</div>;
};

export default Routing;
