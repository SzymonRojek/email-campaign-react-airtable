import { useEffect, useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import { NavBar } from "./components/NavBar";
import api from "./api";
import { Home } from "./pages/home";
import {
  SubscribersList,
  FilteredSubscribersList,
  NewSubscriber,
  SubscriberDetails,
  Subscribers,
} from "./pages/subscribers";
import {
  EditCampaign,
  NewCampaign,
  CampaignsList,
  FilteredCampaignsList,
  Campaigns,
} from "./pages/campaigns";
import { Navigation } from "./components/Navigation";
import { InfoPopup, ConfirmPopup } from "./components/Popup";
import { sortDataAlphabetically, getLatestAddedSubscriber } from "./helpers";
import {
  mainLinksNavigation,
  subscribersLinksNavigation,
  campaignsLinksNavigation,
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
  const [selectedData, setSelectedData] = useState({});

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

  const handleRemoveItem = async (data, endpoint) => {
    await api.delete(`/${endpoint}/${selectedData.id}`);

    data === subscribersData ? getSubscribersData() : getCampaignsData();

    setOpenConfirmPopup(false);

    if (data.data.length === 0) setOpenInfoPopup(true);
    getSubscribersData();
  };

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "active"
      ? navigate(`/subscribers/${subscriber.id}`)
      : setOpenInfoPopup(true);

  const handleEditCampaign = (id) =>
    setSelectedData(
      campaignsData.data
        ? campaignsData.data.filter((item) => item.id === id)[0]
        : null
    );

  const routes = [
    { path: "/", element: <Home /> },
    {
      path: "/subscribers",
      element: <Subscribers />,
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
      path: "/campaigns",
      element: <Campaigns />,
      children: [
        {
          path: "",
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
          path: "/add-email",
          element: (
            <NewCampaign
              getCampaignsData={getCampaignsData}
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
              setOpenInfoPopup={setOpenInfoPopup}
              setContentPopup={setContentPopup}
              selectedData={selectedData}
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
      {/* <Navigation
        className="header-container"
        dataLinks={mainLinksNavigation}
      /> */}
      <NavBar />
      <InfoPopup
        contentPopup={contentPopup}
        openInfoPopup={openInfoPopup}
        setOpenInfoPopup={setOpenInfoPopup}
      />
      <ConfirmPopup
        subscribersData={subscribersData}
        campaignsData={campaignsData}
        selectedData={selectedData}
        handleRemoveItem={handleRemoveItem}
        contentPopup={contentPopup}
        openConfirmPopup={openConfirmPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
      />
      <div>{routing}</div>
    </>
  );
};

export default App;
