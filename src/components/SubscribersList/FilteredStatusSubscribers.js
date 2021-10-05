import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../common/Table";
import { RowSubscriber } from "../common/Table";

const FilteredStatusSubscribers = (props) => {
  const {
    subscribersData,
    dataTableCell,
    status,
    setContentPopup,
    setOpenPopup,
    runHandlersClick,
  } = props;

  return (
    subscribersData &&
    subscribersData.some((el) => el.fields.status === status) && (
      <ContainerTable>
        <HeadTable data={dataTableCell} />

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
                  setContentPopup={setContentPopup}
                  setOpenPopup={setOpenPopup}
                  onClick={() => runHandlersClick(subscriber)}
                />
              ))}
        </BodyTable>
      </ContainerTable>
    )
  );
};

export default FilteredStatusSubscribers;
