import { useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import "./App.css";
import api from "./api";
import { useFetchData } from "useFetchData";
import { MainNavigation, SubNavigation } from "./components/Navigation";
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
} from "./pages/campaigns";
import { InfoPopup, ConfirmPopup } from "./components/DisplayMessage";
import {
  subscribersLinksNavigation,
  campaignsLinksNavigation,
} from "./data/dataLinksNavigation";
import { NotFoundPage } from "pages/notFoundPage";

const AppContainer = ({ setIsLogIn, setStatusLog }) => {
  const navigate = useNavigate();
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [contentPopup, setContentPopup] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedData, setSelectedData] = useState({});
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

  const removeItemFromAirtable = async (endpoint, id) =>
    await api.delete(`/${endpoint}/${id}`);

  const handleRemoveItem = () => {
    const nameGroup = selectedData?.group;
    const selectedId = selectedData.id;

    const filteredGroup = (group) =>
      group.data.filter((item) => item.id !== selectedId);

    if (nameGroup === "subscribers") {
      setSubscribersData({
        status: "success",
        data: filteredGroup(subscribersData),
      });
    }

    if (nameGroup === "campaigns") {
      setCampaignsData({
        status: "success",
        data: filteredGroup(campaignsData),
      });
    }

    removeItemFromAirtable(nameGroup, selectedId);
    setOpenConfirmPopup(false);
  };

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/${subscriber.id}`)
      : setOpenInfoPopup(true);

  const handleEditDetailsCampaign = (campaign) => {
    campaign.fields.status === "draft"
      ? navigate(`/campaigns/${campaign.id}`)
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
              setSelectedData={setSelectedData}
              handleSubscriberDetails={handleSubscriberDetails}
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
              setSubscribersData={setSubscribersData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              getSubscribersData={getSubscribersData}
            />
          ),
        },
        {
          path: "filter",
          element: (
            <SubscribersStatusPage
              subscribersData={subscribersData}
              setSelectedData={setSelectedData}
              handleSubscriberDetails={handleSubscriberDetails}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: ":id",
          element: <SubscriberDetailsPage subscribersData={subscribersData} />,
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
              setSelectedData={setSelectedData}
              handleEditDetailsCampaign={handleEditDetailsCampaign}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "filter",
          element: (
            <CampaignsStatusPage
              campaignsData={campaignsData}
              setSelectedData={setSelectedData}
              handleEditDetailsCampaign={handleEditDetailsCampaign}
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
          path: ":id",
          element: (
            <CampaignEditPage
              campaignsData={campaignsData}
              subscribersData={subscribersData}
              getCampaignsData={getCampaignsData}
              selectedData={selectedData}
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
      <ConfirmPopup
        handleRemoveItem={handleRemoveItem}
        contentPopup={contentPopup}
        openConfirmPopup={openConfirmPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
      />
    </>
  );
};

export default AppContainer;
