import PropTypes from "prop-types";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const dataPerPage = 5;

const CampaignStatus = (props) => {
  const {
    subHeading,
    dataHeadEmailTable,
    passedData,
    status,
    handleEditDetailsCampaign,
    setSelectedData,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  return passedData && passedData.some((el) => el.fields.status === status) ? (
    <CustomPaginator
      passedData={passedData.filter(
        (subscriber) => subscriber.fields.status === status
      )}
      dataPerPage={dataPerPage}
      disableDuration={400}
      disableArrows={false}
      disableDigits={false}
      renderData={(data, actualPage) => (
        <ContainerTable subHeading={subHeading}>
          <HeadTable dataHeadTable={dataHeadEmailTable} />

          <BodyTable>
            {data.map((campaign, index) => (
              <CampaignTableRow
                key={`id-${campaign.id}`}
                campaign={{ ...campaign, group: "campaigns" }}
                index={index}
                actualPage={actualPage}
                dataPerPage={dataPerPage}
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
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

CampaignStatus.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadEmailTable: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default CampaignStatus;
