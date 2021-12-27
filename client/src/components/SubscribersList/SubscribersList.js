import PropTypes from "prop-types";
import { useState } from "react";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { SubscriberTableRow } from "../SubscriberTableRow";
import CustomPaginator from "../PaginationPackage/CustomPaginator";

const dataPerPage = 6;

const SubscribersList = ({
  subHeading,
  dataHeadTable,
  passedData,
  handleSubscriberDetails,
  setSelectedData,
  setContentPopup,
  setOpenConfirmPopup,
}) => {
  const [activatedTablePage, setActiveTablePage] = useState(1);

  return (
    <CustomPaginator
      passedData={passedData}
      dataPerPage={dataPerPage}
      disableDuration={400}
      switcherDisplay="both" //top/bottom/both/none(or another string)
      disableArrows={false} //true/false
      disableDigits={false} //true/false
      setActiveTablePage={setActiveTablePage}
      renderData={(subscribersData) => (
        <ContainerTable subHeading={subHeading}>
          <HeadTable dataHeadTable={dataHeadTable} />
          <BodyTable>
            {subscribersData &&
              subscribersData.map((subscriber, index) => (
                <SubscriberTableRow
                  key={`id-${subscriber.id}`}
                  subscriber={{ ...subscriber, group: "subscribers" }}
                  index={index}
                  dataPerPage={dataPerPage}
                  activatedTablePage={activatedTablePage}
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
  subscribersData: PropTypes.array.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default SubscribersList;

{
  /* <ContainerTable subHeading={subHeading}>
<HeadTable dataHeadTable={dataHeadTable} />
<BodyTable>
  {subscribersData &&
    subscribersData.map((subscriber, index) => (
      <SubscriberTableRow
        key={`id-${subscriber.id}`}
        subscriber={{ ...subscriber, group: "subscribers" }}
        index={index}
        dataPerPage={dataPerPage}
        activatedTablePage={activatedTablePage}
        setSelectedData={setSelectedData}
        handleSubscriberDetails={handleSubscriberDetails}
        setContentPopup={setContentPopup}
        setOpenConfirmPopup={setOpenConfirmPopup}
      />
    ))}
</BodyTable>
</ContainerTable> */
}
