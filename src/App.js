import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Navigation } from "./components/Navigation";
import {
  Subscribers,
  AddSubscriber,
  CreateCampaign,
  ListCampaigns,
} from "./pages";

const App = () => (
  <BrowserRouter>
    <Navigation />

    <Switch>
      <Route exact path="/campaigns">
        <ListCampaigns />
      </Route>

      <Route path="/new-campaign">
        <CreateCampaign />
      </Route>

      <Route exact path="/add-subscriber">
        <AddSubscriber />
      </Route>

      <Route path="/">
        <Subscribers />
      </Route>
    </Switch>
  </BrowserRouter>
);

export default App;
