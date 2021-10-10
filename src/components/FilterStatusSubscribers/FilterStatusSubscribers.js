import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { RowSubscriber } from "../Table";

const FilterStatusSubscribers = (props) => {
  const {
    subscribersData,
    generalDataHeadTable,
    status,
    handlePopup,
    setOpenConfirmPopup,
    setIdClickedSubscriber,
    removeSubscriber,
  } = props;

  return (
    subscribersData &&
    subscribersData.some((el) => el.fields.status === status) && (
      <ContainerTable>
        <HeadTable data={generalDataHeadTable} />

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
                  subscriber={subscriber}
                  index={index}
                  handlePopup={handlePopup}
                  setOpenConfirmPopup={setOpenConfirmPopup}
                  setIdClickedSubscriber={setIdClickedSubscriber}
                  removeSubscriber={removeSubscriber}
                />
              ))}
        </BodyTable>
      </ContainerTable>
    )
  );
};

export default FilterStatusSubscribers;
