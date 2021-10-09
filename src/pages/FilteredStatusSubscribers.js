import { FilterStatusSubscribers } from "../components/FilterStatusSubscribers";

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

const FilteredStatusSubscribers = (props) => {
  const {
    subscribersData,
    setOpenConfirmPopup,
    setIdClickedSubscriber,
    handlePopup,
  } = props;

  return (
    <>
      <FilterStatusSubscribers
        dataTableCell={dataTableCell}
        subscribersData={subscribersData}
        status="active"
        setOpenConfirmPopup={setOpenConfirmPopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
        handlePopup={handlePopup}
      />

      <FilterStatusSubscribers
        dataTableCell={dataTableCell}
        subscribersData={subscribersData}
        status="pending"
        setOpenConfirmPopup={setOpenConfirmPopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
        handlePopup={handlePopup}
      />

      <FilterStatusSubscribers
        dataTableCell={dataTableCell}
        subscribersData={subscribersData}
        status="blocked"
        setOpenConfirmPopup={setOpenConfirmPopup}
        setIdClickedSubscriber={setIdClickedSubscriber}
        handlePopup={handlePopup}
      />
    </>
  );
};

export default FilteredStatusSubscribers;

// do not forget about :hover (fix it)
// think about the row of the table - when ic clicked could be added a border or change bgc etc.
// pagination
// resarcher ??
// check the head of the table - it is a differ betwen head and table container => fix it!
// in the Pop use the function capitalize
