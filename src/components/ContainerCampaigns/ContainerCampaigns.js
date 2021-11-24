import PropTypes from "prop-types";
import { TableCell } from "@material-ui/core";
import {
  ContainerTable,
  HeadTable,
  BodyTable,
  RowCampaign,
} from "../../components/Table";

const ContainerCampaigns = ({
  subHeading,
  dataHeadEmailTable,
  campaignsData,
  handleEditCampaign,
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
              handleEditCampaign={handleEditCampaign}
              setContentPopup={setContentPopup}
              setOpenConfirmPopup={setOpenConfirmPopup}
            />
          ))}
      </BodyTable>
    </ContainerTable>
  );
};

ContainerCampaigns.propTypes = {
  subHeading: PropTypes.string.isRequired,
  dataHeadEmailTable: PropTypes.array.isRequired,
  campaignsData: PropTypes.array.isRequired,
  handleEditCampaign: PropTypes.func.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
};

export default ContainerCampaigns;
