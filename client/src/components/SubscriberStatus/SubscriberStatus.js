import PropTypes from "prop-types";
import { useState } from "react";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  FooterText,
} from "components/Table";
import { SubscriberGeneralData } from "components/SubscriberTableRow/SubscriberGeneralData";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";
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

  const filteredData = getFilteredDataByStatus(passedData, status);

  return (
    <CustomPaginator
      passedData={filteredData}
      dataPerPage={parseInt(selectValue)}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <>
          <ContainerTable
            subHeading={subHeading}
            passedData={filteredData}
            setSelectValue={setSelectValue}
            setSelectStatus={setSelectStatus}
            disableSelect={filteredData.length > 4 ? true : false}
          >
            <HeadTable dataHeadTable={generalDataHeadTable} />

            <BodyTable>
              {data.some((el) => el.fields.status === status)
                ? data.map((subscriber, index) => (
                    <SubscriberGeneralData
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
                  ))
                : []}
            </BodyTable>
          </ContainerTable>
          {filteredData.length < 1 ? (
            <FooterText
              text="There are not subscribers with the status - "
              status={status}
            />
          ) : null}
        </>
      )}
    />
  );
};

SubscriberStatus.propTypes = {
  subHeading: PropTypes.string.isRequired,
  generalDataHeadTable: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func,
  setContentPopup: PropTypes.func,
  setOpenConfirmPopup: PropTypes.func,
};

export default SubscriberStatus;
