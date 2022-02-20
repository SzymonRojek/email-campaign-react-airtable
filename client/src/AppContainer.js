import { useNavigate } from "react-router-dom";

import "App.css";
import api from "api";
import { useAPIcontext } from "contexts/APIcontextProvider";
import Routing from "./Routing";

const AppContainer = () => {
  const navigate = useNavigate();

  const {
    subscribersData,
    setSubscribersData,
    campaignsData,
    setCampaignsData,
  } = useAPIcontext();

  const handleRemoveItem = (id, endpoint) => {
    api.delete(`/${endpoint}/${id}`);

    const filteredGroup = (group) => group.filter((item) => item.id !== id);

    if (endpoint === "subscribers") {
      setSubscribersData({
        status: "success",
        data: filteredGroup(subscribersData.data),
      });
    }

    if (endpoint === "campaigns") {
      setCampaignsData({
        status: "success",
        data: filteredGroup(campaignsData.data),
      });
    }
  };

  const handleSubscriberDetails = (subscriber) => {
    if (subscriber.fields.status === "active")
      navigate(`/subscribers/details/${subscriber.id}`);
  };

  const handleEditSubscriber = (subscriber) =>
    navigate(`/subscribers/edit/${subscriber.id}`);

  const handleEditCampaign = (campaign) => {
    if (campaign.fields.status === "draft") {
      navigate(`/campaigns/edit/${campaign.id}`);
    }
  };

  return (
    <Routing
      handleEditSubscriber={handleEditSubscriber}
      handleSubscriberDetails={handleSubscriberDetails}
      handleEditCampaign={handleEditCampaign}
      handleRemoveItem={handleRemoveItem}
    />
  );
};

export default AppContainer;
