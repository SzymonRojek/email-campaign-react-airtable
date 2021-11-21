import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { RowSubscriber } from "../Table";

const FilterStatusSubscribers = (props) => {
  const {
    subHeading,
    subscribersData,
    generalDataHeadTable,
    status,
    setSelectedData,
    handleSubscriberDetails,
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

export default FilterStatusSubscribers;
