import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "App.css";
import api from "api";
import { useFetchData } from "useFetchData";
import { MainNavigation } from "components/Navigation";
import Routing from "./Routing";

const AppContainer = ({ setIsLogIn, setStatusLog }) => {
  const navigate = useNavigate();
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

  const handleSubscriberDetails = (subscriber) => {
    if (subscriber.fields.status === "active")
      navigate(`/subscribers/details/${subscriber.id}`);
  };

  const handleEditSubscriber = (subscriber) =>
    navigate(`/subscriber/edit/${subscriber.id}`);

  const handleEditCampaign = (campaign) => {
    if (campaign.fields.status === "draft") {
      navigate(`/campaigns/edit/${campaign.id}`);
    }
  };

  return (
    <>
      <MainNavigation
        tabsValue={tabsValue}
        setTabsValue={setTabsValue}
        setIsLogIn={setIsLogIn}
        setStatusLog={setStatusLog}
      />

      <Routing
        subscribersData={subscribersData}
        getSubscribersData={getSubscribersData}
        handleEditSubscriber={handleEditSubscriber}
        handleSubscriberDetails={handleSubscriberDetails}
        campaignsData={campaignsData}
        getCampaignsData={getCampaignsData}
        handleEditCampaign={handleEditCampaign}
        handleRemoveItem={handleRemoveItem}
      />
    </>
  );
};

export default AppContainer;
