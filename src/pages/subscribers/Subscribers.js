import { Navigation } from "../../components/Navigation";
import { subscribersLinksNavigation } from "../../data/dataLinksNavigation";

const Subscribers = () => {
  return (
    <div style={{ marginTop: 100 }}>
      <Navigation dataLinks={subscribersLinksNavigation} />;
    </div>
  );
};

export default Subscribers;
