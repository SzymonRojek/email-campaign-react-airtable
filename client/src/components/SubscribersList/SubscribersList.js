import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

// const dataPerPage = 5;

const SubscribersList = ({
  subHeading,
  dataHeadTable,
  passedData,
  handleSubscriberDetails,
  setSelectedData,
  setContentPopup,
  setOpenConfirmPopup,
}) => {
  const [selectValue, setSelectValue] = useState(4);

  const selectSubscribersNumber = [
    { value: "4", label: "4" },
    { value: "6", label: "6" },
    { value: "8", label: "8" },
    { value: "10", label: "10" },
    { value: `${passedData.length}`, label: `${passedData.length}` },
  ];

  return (
    <CustomPaginator
      passedData={passedData}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <ContainerTable
          subHeading={subHeading}
          setSelectValue={setSelectValue}
          disableSelect={passedData.length > 4 ? true : false}
          data={selectSubscribersNumber}
        >
          <HeadTable dataHeadTable={dataHeadTable} />

          <BodyTable>
            {data.map((subscriber, index) => (
              <SubscriberTableRow
                key={`id-${subscriber.id}`}
                subscriber={{ ...subscriber, group: "subscribers" }}
                index={index}
                actualPage={actualPage}
                dataPerPage={parseInt(selectValue)}
                setSelectedData={setSelectedData}
                handleSubscriberDetails={handleSubscriberDetails}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            ))}
          </BodyTable>
        </ContainerTable>
      )}
    />
  );
};
SubscribersList.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadTable: PropTypes.array.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default SubscribersList;
