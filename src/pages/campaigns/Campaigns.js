import { Navigation } from "../../components/Navigation";
import { campaignsLinksNavigation } from "../../data/dataLinksNavigation";

const Campaigns = () => {
  return (
    <div style={{ marginTop: 100 }}>
      <Navigation dataLinks={campaignsLinksNavigation} />;
    </div>
  );
};

export default Campaigns;
