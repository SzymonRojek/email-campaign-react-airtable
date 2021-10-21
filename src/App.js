import { useEffect, useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import api from "./api";
import {
  Home,
  SubscribersList,
  FilteredSubscribersList,
  NewSubscriber,
  SubscriberDetails,
  CampaignsList,
  FilteredCampaignsList,
  EditCampaign,
  NewCampaign,
} from "./pages";
import { Navigation } from "./components/Navigation";
import { InfoPopup, ConfirmPopup } from "./components/Popup";
import { sortDataAlphabetically, getLatestAddedSubscriber } from "./helpers";
import {
  mainLinksNavigation,
  subscribersLinksNavigation,
  emailLinksNavigation,
} from "./data/dataLinksNavigation";

const App = () => {
  const navigate = useNavigate();
  const [subscribersData, setSubscribersData] = useState({
    status: "loading",
    data: null,
    latestSubscriber: null,
  });
  const [campaignsData, setCampaignsData] = useState({
    status: "loading",
    data: null,
  });
  const [openInfoPopup, setOpenInfoPopup] = useState(false);
  const [contentPopup, setContentPopup] = useState({});
  const [openConfirmPopup, setOpenConfirmPopup] = useState(false);
  const [idClickedItem, setIdClickedItem] = useState(null);
  const [draftCampaign, setDraftCampaign] = useState({});

  const endpointSubscribers = "/subscribers";
  const endpointCampaigns = "/campaigns";

  const getSubscribersData = async () => {
    try {
      const { records } = await api.get(endpointSubscribers);

      sortDataAlphabetically(records);
      setSubscribersData({
        status: "success",
        data: records,
        latestSubscriber: getLatestAddedSubscriber(records),
      });
    } catch (error) {
      setSubscribersData({
        status: "error",
      });
    }
  };

  useEffect(() => {
    const delayGetSubscribersData = setTimeout(getSubscribersData, 1500);

    return () => clearTimeout(delayGetSubscribersData);
  }, []);

  const getCampaignsData = async () => {
    try {
      const { records } = await api.get(endpointCampaigns);

      sortDataAlphabetically(records);
      setCampaignsData({
        status: "success",
        data: records,
        latestCampaign: getLatestAddedSubscriber(records),
      });
    } catch (error) {
      setCampaignsData({
        status: "error",
      });
    }
  };

  useEffect(() => {
    const delayGetCampaignData = setTimeout(getCampaignsData, 1500);

    return () => clearTimeout(delayGetCampaignData);
  }, []);

  const handleRemoveItem = async (selectedData, endpoint) => {
    const idItemToRemove = selectedData.data.filter(
      (item) => item.id === idClickedItem
    )[0].id;

    await api.delete(`/${endpoint}/${idItemToRemove}`);

    selectedData === subscribersData
      ? getSubscribersData()
      : getCampaignsData();

    setOpenConfirmPopup(false);

    if (selectedData.data.length === 0) setOpenInfoPopup(true);
  };

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/${subscriber.id}`)
      : setOpenInfoPopup(true);

  const handleDraftCampaign = (id) =>
    setDraftCampaign(
      campaignsData.data
        ? campaignsData.data.filter((item) => item.id === id)[0]
        : null
    );

  const routes = [
    { path: "/", element: <Home /> },
    {
      path: "/subscribers",
      element: <Navigation dataLinks={subscribersLinksNavigation} />,
      children: [
        {
          path: "/",
          element: (
            <SubscribersList
              subscribersData={subscribersData}
              setIdClickedItem={setIdClickedItem}
              handleSubscriberDetails={handleSubscriberDetails}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "/add-subscriber",
          element: (
            <NewSubscriber
              getSubscribersData={getSubscribersData}
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
              handleSubscriberDetails={handleSubscriberDetails}
              setIdClickedItem={setIdClickedItem}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "/:id",
          element: (
            <SubscriberDetails
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
      ],
    },
    {
      path: "/campaigns",
      element: <Navigation dataLinks={emailLinksNavigation} />,
      children: [
        {
          path: "",
          element: (
            <CampaignsList
              campaignsData={campaignsData}
              setIdClickedItem={setIdClickedItem}
              handleDraftCampaign={handleDraftCampaign}
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
              handleDraftCampaign={handleDraftCampaign}
              setIdClickedItem={setIdClickedItem}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        {
          path: "/add-email",
          element: (
            <NewCampaign
              getCampaignsData={getCampaignsData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
        {
          path: "/:id",
          element: (
            <EditCampaign
              setOpenInfoPopup={setOpenInfoPopup}
              setContentPopup={setContentPopup}
              draftCampaign={draftCampaign}
              getCampaignsData={getCampaignsData}
            />
          ),
        },
      ],
    },
  ];

  const routing = useRoutes(routes);

  return (
    <>
      <Navigation
        className="header-container"
        dataLinks={mainLinksNavigation}
      />
      <InfoPopup
        contentPopup={contentPopup}
        openInfoPopup={openInfoPopup}
        setOpenInfoPopup={setOpenInfoPopup}
      />
      <ConfirmPopup
        subscribersData={subscribersData}
        campaignsData={campaignsData}
        idClickedItem={idClickedItem}
        setIdClickedItem={setIdClickedItem}
        removeItem={handleRemoveItem}
        contentPopup={contentPopup}
        openConfirmPopup={openConfirmPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
      />
      <div>{routing}</div>
    </>
  );
};

export default App;
