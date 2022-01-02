import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

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
          passedData={passedData}
          setSelectValue={setSelectValue}
          disableSelect={passedData.length > 4 ? true : false}
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
