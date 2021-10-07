import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Navigation } from "./components/Navigation";
import { Subscribers, CreateCampaign, ListCampaigns, Home } from "./pages";

const App = () => (
  <BrowserRouter>
    <Navigation />

    <Switch>
      <Route exact path="/campaigns" component={ListCampaigns} />

      <Route exact path="/new-campaign" component={CreateCampaign} />

      <Route exact path="/subscribers" component={Subscribers} />

      <Route exact path="/" component={Home} />
    </Switch>
  </BrowserRouter>
);

export default App;
