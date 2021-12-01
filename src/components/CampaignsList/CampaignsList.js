import PropTypes from "prop-types";
import { TableCell } from "@material-ui/core";
import { ContainerTable, HeadTable, BodyTable, RowCampaign } from "../Table";

const CampaignsList = ({
  subHeading,
  dataHeadEmailTable,
  campaignsData,
  handleEditDetailsCampaign,
  setSelectedData,
  setContentPopup,
  setOpenConfirmPopup,
}) => {
  return (
    <ContainerTable subHeading={subHeading}>
      <HeadTable dataHeadTable={dataHeadEmailTable} />
      <BodyTable>
        {campaignsData &&
          campaignsData.map((campaign, index) => (
            <RowCampaign
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
  );
};

CampaignsList.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadEmailTable: PropTypes.array.isRequired,
  campaignsData: PropTypes.array.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default CampaignsList;
