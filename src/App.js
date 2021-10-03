import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Navigation } from "./components/Navigation";
import { Subscribers, CreateCampaign, ListCampaigns, Home } from "./pages";

const App = () => (
  <BrowserRouter>
    <Navigation />

    <Switch>
      <Route exact path="/campaigns">
        <ListCampaigns />
      </Route>

      <Route exact path="/new-campaign">
        <CreateCampaign />
      </Route>

      <Route exact path="/subscribers">
        <Subscribers />
      </Route>

      <Route exact path="/">
        <Home />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
