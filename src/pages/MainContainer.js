import { useEffect, useState } from "react";
import { useRoutes, useNavigate } from "react-router-dom";

import api from "../api";
import {
  SubscribersList,
  NewEmailCampaign,
  EmailCampaignsList,
  FilterStatusEmail,
  Home,
  AddSubscriber,
  FilteredStatusSubscribers,
  SubscriberDetails,
} from "./pagesApp";
import { Navigation } from "../components/Navigation";
import { InfoPopup, ConfirmPopup } from "../components/Popup";
import { sortDataAlphabetically, getLatestAddedSubscriber } from "../helpers";
import {
  mainLinksNavigation,
  subscribersLinksNavigation,
  emailLinksNavigation,
} from "../data/dataLinksNavigation";

const MainContainer = () => {
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

  const endpointSubscribers = "/subscribers";
  const endpointCampaign = "/campaigns";

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
      const data = await api.get(endpointCampaign);

      const dataRecords = data.records;
      sortDataAlphabetically(dataRecords);
      setCampaignsData({
        status: "success",
        data: dataRecords,
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

  const handlerRemoveItem = async (selectedData, endpoint) => {
    const idSubscriber = selectedData.data.filter(
      (item) => item.id === idClickedItem
    )[0].id;

    await api.delete(`/${endpoint}/${idSubscriber}`);

    selectedData === subscribersData
      ? getSubscribersData()
      : getCampaignsData();

    setOpenConfirmPopup(false);

    if (selectedData.data.length === 0) setOpenInfoPopup(true);
  };

  const handleSubscriberDetails = (subscriber) =>
    subscriber.fields.status === "pending" ||
    subscriber.fields.status === "blocked"
      ? setOpenInfoPopup(true)
      : subscriber.fields.status === "active"
      ? navigate(`/subscribers/${subscriber.id}`)
      : "";

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
            <AddSubscriber
              getSubscribersData={getSubscribersData}
              setContentPopup={setContentPopup}
              setOpenInfoPopup={setOpenInfoPopup}
            />
          ),
        },
        {
          path: "/filter",
          element: (
            <FilteredStatusSubscribers
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
            <EmailCampaignsList
              campaignsData={campaignsData}
              setIdClickedItem={setIdClickedItem}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ),
        },
        { path: "/filter", element: <FilterStatusEmail /> },
        { path: "/add-email", element: <NewEmailCampaign /> },
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
        removeItem={handlerRemoveItem}
        contentPopup={contentPopup}
        openConfirmPopup={openConfirmPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
      />
      <div>{routing}</div>
    </>
  );
};

export default MainContainer;
