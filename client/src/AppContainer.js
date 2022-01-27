import { useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import "App.css";
import api from "api";
import { useFetchData } from "useFetchData";
import { MainNavigation, SubNavigation } from "components/Navigation";
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
import { InfoPopup } from "components/DisplayMessage";
import {
  subscribersLinksNavigation,
  campaignsLinksNavigation,
} from "data/dataLinksNavigation";
import { NotFoundPage } from "pages/notFoundPage";

const AppContainer = ({ setIsLogIn, setStatusLog }) => {
  const navigate = useNavigate();
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [contentPopup, setContentPopup] = useState({});
  const [setOpenConfirmPopup] = useState(false);
  const [tabsValue, setTabsValue] = useState(0);

  const endpointSubscribers = "/subscribers";
  const endpointCampaigns = "/campaigns";

  const {
    data: subscribersData,
    setData: setSubscribersData,
    getData: getSubscribersData,
  } = useFetchData(endpointSubscribers);

  const {
    data: campaignsData,
    setData: setCampaignsData,
    getData: getCampaignsData,
  } = useFetchData(endpointCampaigns);

  const handleRemoveItem = (id, endpoint) => {
    api.delete(`/${endpoint}/${id}`);

    const filteredGroup = (group) =>
      group.data.filter((item) => item.id !== id);

    if (endpoint === "subscribers") {
      setSubscribersData({
        status: "success",
        data: filteredGroup(subscribersData),
      });
    }

    if (endpoint === "campaigns") {
      setCampaignsData({
        status: "success",
        data: filteredGroup(campaignsData),
      });
    }
  };

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/item/${subscriber.id}`)
      : setOpenInfoPopup(true);

  const handleEditDetailsCampaign = (campaign) => {
    campaign.fields.status === "draft"
      ? navigate(`/campaigns/item/${campaign.id}`)
      : setOpenInfoPopup(true);
  };

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
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={handleRemoveItem}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "add",
          element: (
            <AddSubscriberPage
              subscribersData={subscribersData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              getSubscribersData={getSubscribersData}
            />
          ),
        },
        {
          path: "status",
          element: (
            <SubscribersStatusPage
              subscribersData={subscribersData}
              handleSubscriberDetails={handleSubscriberDetails}
              removeSubscriber={handleRemoveItem}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "/item/:id",
          element: <SubscriberDetailsPage />,
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
              handleEditDetailsCampaign={handleEditDetailsCampaign}
              removeCampaign={handleRemoveItem}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "status",
          element: (
            <CampaignsStatusPage
              campaignsData={campaignsData}
              handleEditDetailsCampaign={handleEditDetailsCampaign}
              removeCampaign={handleRemoveItem}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "add",
          element: (
            <AddCampaignPage
              subscribersData={subscribersData}
              getCampaignsData={getCampaignsData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
        {
          path: "/item/:id",
          element: (
            <CampaignEditPage
              subscribersData={subscribersData}
              getCampaignsData={getCampaignsData}
              setOpenInfoPopup={setOpenInfoPopup}
              setContentPopup={setContentPopup}
            />
          ),
        },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ];

  const routing = useRoutes(routes);

  return (
    <>
      <MainNavigation
        tabsValue={tabsValue}
        setTabsValue={setTabsValue}
        setIsLogIn={setIsLogIn}
        setStatusLog={setStatusLog}
      />

      <div className="routing-container">{routing}</div>

      <InfoPopup
        contentPopup={contentPopup}
        openInfoPopup={openInfoPopup}
        setOpenInfoPopup={setOpenInfoPopup}
      />
    </>
  );
};

export default AppContainer;
