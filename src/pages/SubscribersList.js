import { TableCell } from "@material-ui/core";
import { ContainerTable, HeadTable, BodyTable } from "../components/Table";
import { RowSubscriber } from "../components/Table";

const SubscribersList = ({
  subscribersData,
  setOpenConfirmPopup,
  handlePopup,
  setIdClickedSubscriber,
}) => {
  const dataTableCell = [
    "No",
    "Name",
    "Surname",
    "Profession",
    "Status",
    "Created",
    "Details",
    "Delete",
  ];

  return (
    <ContainerTable>
      <HeadTable data={dataTableCell} />

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
              setOpenConfirmPopup={setOpenConfirmPopup}
              handlePopup={handlePopup}
              setIdClickedSubscriber={setIdClickedSubscriber}
            />
          ))}
      </BodyTable>
    </ContainerTable>
  );
};

export default SubscribersList;
