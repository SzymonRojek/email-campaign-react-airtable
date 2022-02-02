import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "App.css";
import api from "api";
import { useAPI } from "./APiContextProvider";
import { MainNavigation } from "components/Navigation";
import Routing from "./Routing";

const AppContainer = ({ setIsLogIn, setStatusLog }) => {
  const navigate = useNavigate();
  const [tabsValue, setTabsValue] = useState(0);

  const {
    subscribersData,
    setSubscribersData,
    campaignsData,
    setCampaignsData,
  } = useAPI();

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
        handleEditSubscriber={handleEditSubscriber}
        handleSubscriberDetails={handleSubscriberDetails}
        handleEditCampaign={handleEditCampaign}
        handleRemoveItem={handleRemoveItem}
      />
    </>
  );
};

export default AppContainer;
