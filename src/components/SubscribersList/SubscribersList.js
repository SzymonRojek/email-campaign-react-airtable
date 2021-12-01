import PropTypes from "prop-types";
import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable, RowSubscriber } from "../Table";

const SubscribersList = ({
  subHeading,
  dataHeadTable,
  subscribersData,
  handleSubscriberDetails,
  setSelectedData,
  setContentPopup,
  setOpenConfirmPopup,
}) => (
  <ContainerTable subHeading={subHeading}>
    <HeadTable dataHeadTable={dataHeadTable} />
    <BodyTable>
      {subscribersData &&
        subscribersData.map((subscriber, index) => (
          <RowSubscriber
            children={
              <TableCell component="th" scope="row">
                {++index}.
              </TableCell>
            }
            key={`id-${subscriber.id}`}
            subscriber={{ ...subscriber, group: "subscribers" }}
            index={index}
            setSelectedData={setSelectedData}
            handleSubscriberDetails={handleSubscriberDetails}
            setContentPopup={setContentPopup}
            setOpenConfirmPopup={setOpenConfirmPopup}
          />
        ))}
    </BodyTable>
  </ContainerTable>
);

SubscribersList.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadTable: PropTypes.array.isRequired,
  subscribersData: PropTypes.array.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default SubscribersList;
