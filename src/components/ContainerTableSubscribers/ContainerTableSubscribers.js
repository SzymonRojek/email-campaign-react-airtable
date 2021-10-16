import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable, RowSubscriber } from "../Table";

const ContainerTableSubscribers = ({
  dataHeadTable,
  subscribersData,
  setIdClickedItem,
  handleSubscriberDetails,
  setContentPopup,
  setOpenConfirmPopup,
}) => (
  <ContainerTable>
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
            subscriber={subscriber}
            index={index}
            setIdClickedItem={setIdClickedItem}
            handleSubscriberDetails={handleSubscriberDetails}
            setContentPopup={setContentPopup}
            setOpenConfirmPopup={setOpenConfirmPopup}
          />
        ))}
    </BodyTable>
  </ContainerTable>
);

export default ContainerTableSubscribers;
