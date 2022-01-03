import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { SubscriberTableRow } from "../SubscriberTableRow";
import CustomPaginator from "../PaginationPackage/CustomPaginator";
import { getFilteredDataByStatus } from "helpers";

const SubscriberStatus = (props) => {
  const {
    subHeading,
    generalDataHeadTable,
    passedData,
    status,
    handleSubscriberDetails,
    setSelectedData,
    setSelectStatus,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  const [selectValue, setSelectValue] = useState(4);

  return passedData && passedData.some((el) => el.fields.status === status) ? (
    <CustomPaginator
      passedData={getFilteredDataByStatus(passedData, status)}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <ContainerTable
          subHeading={subHeading}
          passedData={getFilteredDataByStatus(passedData, status)}
          setSelectValue={setSelectValue}
          setSelectStatus={setSelectStatus}
          disableSelect={
            getFilteredDataByStatus(passedData, status).length > 4
              ? true
              : false
          }
        >
          <HeadTable dataHeadTable={generalDataHeadTable} />

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
  ) : (
    ""
  );
};

SubscriberStatus.propTypes = {
  subHeading: PropTypes.string.isRequired,
  generalDataHeadTable: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default SubscriberStatus;
