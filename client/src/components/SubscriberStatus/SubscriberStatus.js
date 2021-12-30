import PropTypes from "prop-types";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { SubscriberTableRow } from "components/SubscriberTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const dataPerPage = 5;

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

  return passedData && passedData.some((el) => el.fields.status === status) ? (
    <CustomPaginator
      passedData={
        passedData &&
        passedData.filter((subscriber) => subscriber.fields.status === status)
      }
      dataPerPage={dataPerPage}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <ContainerTable subHeading={subHeading}>
          <HeadTable dataHeadTable={generalDataHeadTable} />

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
