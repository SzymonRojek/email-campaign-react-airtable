import { Container } from "@material-ui/core";

import { Navigation } from "../../components/Navigation";
import { campaignsLinksNavigation } from "../../data/dataLinksNavigation";

const Campaigns = () => {
  return (
    <Container>
      <Navigation dataLinks={campaignsLinksNavigation} />;
    </Container>
  );
};

export default Campaigns;
