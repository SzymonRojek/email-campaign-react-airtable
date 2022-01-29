import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberGeneralData } from "components/SubscriberTableRow/SubscriberGeneralData";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const SubscribersList = (props) => {
  const {
    subHeading,
    dataHeadTable,
    passedData,
    editSubscriber,
    handleSubscriberDetails,
    removeSubscriber,
  } = props;
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
  handleSubscriberDetails: PropTypes.func,
  setSelectedData: PropTypes.func,
};

export default SubscribersList;
