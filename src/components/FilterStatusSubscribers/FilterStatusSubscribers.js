import PropTypes from "prop-types";
import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { RowSubscriber } from "../Table";

const FilterStatusSubscribers = (props) => {
  const {
    subHeading,
    generalDataHeadTable,
    subscribersData,
    status,
    handleSubscriberDetails,
    setSelectedData,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  return subscribersData &&
    subscribersData.some((el) => el.fields.status === status) ? (
    <ContainerTable subHeading={subHeading}>
      <HeadTable dataHeadTable={generalDataHeadTable} />

      <BodyTable>
        {subscribersData &&
          subscribersData
            .filter((subscriber) => subscriber.fields.status === status)
            .map((subscriber, index) => (
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
  ) : (
    ""
  );
};

FilterStatusSubscribers.propTypes = {
  subHeading: PropTypes.string.isRequired,
  generalDataHeadTable: PropTypes.array.isRequired,
  subscribersData: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default FilterStatusSubscribers;
