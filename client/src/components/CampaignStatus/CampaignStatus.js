import PropTypes from "prop-types";
import { TableCell } from "@material-ui/core";

import { ContainerTable, HeadTable, BodyTable } from "../Table";
import { CampaignTableRow } from "../CampaignTableRow";

const CampaignStatus = (props) => {
  const {
    subHeading,
    dataHeadEmailTable,
    campaignsData,
    status,
    handleEditDetailsCampaign,
    setSelectedData,
    setContentPopup,
    setOpenConfirmPopup,
  } = props;

  return campaignsData &&
    campaignsData.some((el) => el.fields.status === status) ? (
    <ContainerTable subHeading={subHeading}>
      <HeadTable dataHeadTable={dataHeadEmailTable} />

      <BodyTable>
        {campaignsData &&
          campaignsData
            .filter((subscriber) => subscriber.fields.status === status)
            .map((campaign, index) => (
              <CampaignTableRow
                children={
                  <TableCell component="th" scope="row">
                    {++index}.
                  </TableCell>
                }
                key={`id-${campaign.id}`}
                campaign={{ ...campaign, group: "campaigns" }}
                index={index}
                setSelectedData={setSelectedData}
                handleEditDetailsCampaign={handleEditDetailsCampaign}
                setContentPopup={setContentPopup}
                setOpenConfirmPopup={setOpenConfirmPopup}
              />
            ))}
      </BodyTable>
    </ContainerTable>
  ) : (
    ""
  );
};

CampaignStatus.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadEmailTable: PropTypes.array.isRequired,
  campaignsData: PropTypes.array.isRequired,
  status: PropTypes.string.isRequired,
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default CampaignStatus;
