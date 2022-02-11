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
    editSubscriber,
    handleSubscriberDetails,
    removeSubscriber,
    status,
    setSelectStatus,
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
                      subscriber={subscriber}
                      index={index}
                      actualPage={actualPage}
                      dataPerPage={parseInt(selectValue)}
                      editSubscriber={editSubscriber}
                      handleSubscriberDetails={handleSubscriberDetails}
                      removeSubscriber={removeSubscriber}
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
  subHeading: PropTypes.string,
  generalDataHeadTable: PropTypes.array,
  passedData: PropTypes.arrayOf(PropTypes.object),
  handleSubscriberDetails: PropTypes.func,
  removeSubscriber: PropTypes.func,
  status: PropTypes.string,
  setSelectStatus: PropTypes.func,
};

export default SubscriberStatus;
