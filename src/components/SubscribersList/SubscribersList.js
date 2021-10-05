import { useHistory } from "react-router-dom";
import {
  BrowserRouter as Switch,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { Button, Box } from "@mui/material";

import { setTextPopup } from "./../../helpers";
import handlers from "./../../helpers/handlers";
import FilteredStatusSubscribers from "./FilteredStatusSubscribers";
import UnfilteredSubscribersList from "./UnfilteredSubscribersList";

const dataTableCell = ["No", "Name", "Surname", "Email", "Status", "Created"];

const SubscribersList = ({
  subscribersData,
  setContentPopup,
  setOpenPopup,
}) => {
  const history = useHistory();

  const runHandlersClick = (subscriber) => {
    handlers.handleRowClick(subscriber, history);
    setTextPopup(
      subscriber.fields.status,
      subscriber.fields.name,
      setContentPopup
    );
    handlers.handleOpenPopup(subscriber, setOpenPopup);
  };

  return (
    <Switch>
      <Route
        exact
        path="/filtered-status"
        render={() => (
          <>
            <FilteredStatusSubscribers
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              status="active"
              setContentPopup={setContentPopup}
              setOpenPopup={setOpenPopup}
              runHandlersClick={runHandlersClick}
            />

            <FilteredStatusSubscribers
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              status="pending"
              setContentPopup={setContentPopup}
              setOpenPopup={setOpenPopup}
              runHandlersClick={runHandlersClick}
            />

            <FilteredStatusSubscribers
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              status="blocked"
              setContentPopup={setContentPopup}
              setOpenPopup={setOpenPopup}
              runHandlersClick={runHandlersClick}
            />
          </>
        )}
      />

      <Route
        exact
        path="/subscribers"
        render={() => (
          <>
            <UnfilteredSubscribersList
              dataTableCell={dataTableCell}
              subscribersData={subscribersData}
              setContentPopup={setContentPopup}
              setOpenPopup={setOpenPopup}
              runHandlersClick={runHandlersClick}
            />

            <Box display="flex" justifyContent="center" alignItems="center">
              <Button
                component={RouterLink}
                to="/filtered-status"
                variant="contained"
                color="secondary"
              >
                Filter By Status
              </Button>
            </Box>
          </>
        )}
      />
    </Switch>
  );
};

export default SubscribersList;

// do not forget about :hover (fix it)
// think about the row of the table - when ic clicked could be added a border or change bgc etc.
// pagination
// resarcher ??
// filter by alphabeth
