import { useNavigate } from "react-router-dom";

import "App.css";
import Routing from "./Routing";
import { MainNavigation } from "components/Navigation";
import { Login } from "./Login";
import { StyledFooter } from "components/StyledFooter";
import { GlobalStoreContextProvider } from "contexts/GlobalStoreContextProvider";
import Modals from "./Modals";

export const AppContainer = () => {
  const navigate = useNavigate();

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
    <Modals>
      <GlobalStoreContextProvider>
        <MainNavigation />

        <Login>
          <Routing
            handleEditSubscriber={handleEditSubscriber}
            handleSubscriberDetails={handleSubscriberDetails}
            handleEditCampaign={handleEditCampaign}
          />
        </Login>

        <StyledFooter label="Coded By Szymon Rojek © 2022" />
      </GlobalStoreContextProvider>
    </Modals>
  );
};
