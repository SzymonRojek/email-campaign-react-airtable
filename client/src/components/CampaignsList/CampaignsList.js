import PropTypes from "prop-types";
import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "components/Table";
import { CampaignTableRow } from "components/CampaignTableRow";
import CustomPaginator from "components/PaginationPackage/CustomPaginator";

const dataPerPage = 5;

const CampaignsList = ({
  subHeading,
  dataHeadEmailTable,
  passedData,
  handleEditDetailsCampaign,
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
        <HeadTable dataHeadTable={dataHeadEmailTable} />
        <BodyTable>
          {data &&
            data.map((campaign, index) => (
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
);

CampaignsList.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadEmailTable: PropTypes.array.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default CampaignsList;
