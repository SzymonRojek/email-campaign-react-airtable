import { useNavigate } from "react-router-dom";

import "App.css";
import Routing from "./Routing";
import { MainNavigation } from "components/Navigation";
import { Login } from "./Login";
import { StyledFooter } from "components/StyledFooter";
import { GlobalStoreContextProvider } from "contexts/GlobalStoreContextProvider";
import Modals from "./Modals";
import { Campaign } from "types";

export const AppContainer = () => {
  const navigate = useNavigate();

  const handleEditCampaign = (campaign: Campaign) => {
    if (campaign.fields.status === "draft") {
      navigate(`/campaigns/edit/${campaign.id}`);
    }
  };

  return (
    <Modals>
      <GlobalStoreContextProvider>
        <MainNavigation />

        <main className="flex flex-1 flex-col">
          <Login>
            <Routing handleEditCampaign={handleEditCampaign} />
          </Login>
        </main>

        <StyledFooter label="Coded By Szymon Rojek © 2022" />
      </GlobalStoreContextProvider>
    </Modals>
  );
};
