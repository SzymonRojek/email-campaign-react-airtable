import { FilterStatusSubscribers } from "../../components/FilterStatusSubscribers";

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
