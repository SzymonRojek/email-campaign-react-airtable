import { useState, useEffect } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import "./App.css";
import api from "./api";
import { useFetchData } from "./useFetchData";
import { MainNavigation } from "./components/MainNavigation";
import { SubNavigation } from "./components/SubNavigation";
import { StyledFooter } from "./components/StyledFooter";
import { Home } from "./pages/home";
import {
  SubscribersList,
  FilteredSubscribersList,
  NewSubscriber,
  SubscriberDetails,
} from "./pages/subscribers";
import {
  EditCampaign,
  NewCampaign,
  CampaignsList,
  FilteredCampaignsList,
} from "./pages/campaigns";
import { InfoPopup, ConfirmPopup } from "./components/Popup";
import { getLatestAddedItem } from "./helpers";
import {
  subscribersLinksNavigation,
  campaignsLinksNavigation,
} from "./data/dataLinksNavigation";

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
    refetchData,
  ] = useFetchData(endpointSubscribers, endpointCampaigns);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isCalledRefSubscribers.current) refetchData();
      if (!isCalledRefCampaigns.current) refetchData();
    }, 3_000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isCalledRefSubscribers, isCalledRefCampaigns, refetchData]);

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/${subscriber.id}`)
      : setOpenInfoPopup(true);

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

  const handleEditCampaign = (id) =>
    setSelectedData(
      campaignsData.data
        ? campaignsData.data.filter((item) => item.id === id)[0]
        : null
    );

  const routes = [
    { path: "/", element: <Home /> },
    {
      path: endpointSubscribers,
      element: <SubNavigation dataLinks={subscribersLinksNavigation} />,
      children: [
        {
          path: "/",
          element: (
            <SubscribersList
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
          path: "/add",
          element: (
            <NewSubscriber
              setSubscribersData={setSubscribersData}
              isCalledRefSubscribers={isCalledRefSubscribers}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
        {
          path: "/filter",
          element: (
            <FilteredSubscribersList
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
          path: "/:id",
          element: <SubscriberDetails />,
        },
      ],
    },
    {
      path: endpointCampaigns,
      element: <SubNavigation dataLinks={campaignsLinksNavigation} />,
      children: [
        {
          path: "/",
          element: (
            <CampaignsList
              campaignsData={campaignsData}
              setSelectedData={setSelectedData}
              handleEditCampaign={handleEditCampaign}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "/filter",
          element: (
            <FilteredCampaignsList
              campaignsData={campaignsData}
              setSelectedData={setSelectedData}
              handleEditCampaign={handleEditCampaign}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "/add",
          element: (
            <NewCampaign
              isCalledRefCampaigns={isCalledRefCampaigns}
              subscribersData={subscribersData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
        {
          path: "/:id",
          element: (
            <EditCampaign
              subscribersData={subscribersData}
              isCalledRefCampaigns={isCalledRefCampaigns}
              setOpenInfoPopup={setOpenInfoPopup}
              setContentPopup={setContentPopup}
              selectedData={selectedData}
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

      <StyledFooter />

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