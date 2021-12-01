import { useState, useEffect } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import "App.css";
import api from "api";
import { useFetchData } from "useFetchData";
import { MainNavigation, SubNavigation } from "components/Navigation";
import { StyledFooter } from "components/StyledFooter";
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
import { InfoPopup, ConfirmPopup } from "components/DisplayMessage";
import { getLatestAddedItem } from "helpers";
import {
  subscribersLinksNavigation,
  campaignsLinksNavigation,
} from "data/dataLinksNavigation";
import { NotFoundPage } from "pages/notFoundPage";

const AppContainer = () => {
  const navigate = useNavigate();
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [contentPopup, setContentPopup] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [tabsValue, setTabsValue] = useState(0);

  const endpointSubscribers = "/subscribers";
  const endpointCampaigns = "/campaigns";

  const [
    {
      subscribersData,
      setSubscribersData,
      campaignsData,
      setCampaignsData,
      isCalledRefSubscribers,
      isCalledRefCampaigns,
    },
    refetchSubscribersData,
    refetchCampaignsData,
  ] = useFetchData(endpointSubscribers, endpointCampaigns);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isCalledRefSubscribers.current) refetchSubscribersData();
      if (!isCalledRefCampaigns.current) refetchCampaignsData();
    }, 3_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [
    isCalledRefSubscribers,
    isCalledRefCampaigns,
    refetchSubscribersData,
    refetchCampaignsData,
  ]);

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
        latestAddedItem: getLatestAddedItem(filteredGroup(subscribersData)),
      });
    }

    if (nameGroup === "campaigns") {
      setCampaignsData({
        status: "success",
        data: filteredGroup(campaignsData),
        latestAddedItem: getLatestAddedItem(filteredGroup(campaignsData)),
      });
    }

    removeItemFromAirtable(nameGroup, selectedId);
    setOpenConfirmPopup(false);
  };

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/details/${subscriber.id}`)
      : setOpenInfoPopup(true);

  const handleEditDetailsCampaign = (campaign) => {
    campaign.fields.status === "draft"
      ? navigate(`/campaigns/details/${campaign.id}`)
      : setOpenInfoPopup(true);
  };

  const routes = [
    { path: "*", element: <NotFoundPage /> },
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
              isCalledRefSubscribers={isCalledRefSubscribers}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
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
          path: "details/:id",
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
              isCalledRefCampaigns={isCalledRefCampaigns}
              subscribersData={subscribersData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
        {
          path: "details/:id",
          element: (
            <CampaignEditPage
              campaignsData={campaignsData}
              selectedData={selectedData}
              isCalledRefCampaigns={isCalledRefCampaigns}
              setOpenInfoPopup={setOpenInfoPopup}
              setContentPopup={setContentPopup}
            />
          ),
        },
      ],
    },
  ];

  const routing = useRoutes(routes);

  return (
    <>
      <MainNavigation tabsValue={tabsValue} setTabsValue={setTabsValue} />

      <div className="routing-children">{routing}</div>

      <StyledFooter label="Coded By Szymon Rojek © 2021" />

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
