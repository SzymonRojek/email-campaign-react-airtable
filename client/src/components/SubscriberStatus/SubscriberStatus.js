import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const SubscriberStatus = (props) => {
  const {
    subHeading,
    generalDataHeadTable,
    passedData,
    status,
    handleSubscriberDetails,
    setSelectedData,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  const [selectValue, setSelectValue] = useState(4);

  return passedData && passedData.some((el) => el.fields.status === status) ? (
    <CustomPaginator
      passedData={passedData.filter(
        (subscriber) => subscriber.fields.status === status
      )}
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
