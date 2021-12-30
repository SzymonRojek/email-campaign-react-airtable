import PropTypes from "prop-types";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const dataPerPage = 5;

const SubscribersList = ({
  subHeading,
  dataHeadTable,
  passedData,
  handleSubscriberDetails,
  setSelectedData,
  setContentPopup,
  setOpenConfirmPopup,
}) => (
  <CustomPaginator
    passedData={passedData}
    dataPerPage={dataPerPage}
    disableDuration={400}
    disableArrows={false}
    disableDigits={false}
    renderData={(data, actualPage) => (
      <ContainerTable subHeading={subHeading}>
        <HeadTable dataHeadTable={dataHeadTable} />
        <BodyTable>
          {data.map((subscriber, index) => (
            <SubscriberTableRow
              key={`id-${subscriber.id}`}
              subscriber={{ ...subscriber, group: "subscribers" }}
              index={index}
              actualPage={actualPage}
              dataPerPage={dataPerPage}
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

SubscribersList.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadTable: PropTypes.array.isRequired,
  handleSubscriberDetails: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default SubscribersList;
