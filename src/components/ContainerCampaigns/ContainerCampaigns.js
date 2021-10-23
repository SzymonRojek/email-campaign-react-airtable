import { TableCell } from "@material-ui/core";
import {
  ContainerTable,
  HeadTable,
  BodyTable,
  RowCampaign,
} from "../../components/Table";

const ContainerCampaigns = ({
  dataHeadEmailTable,
  campaignsData,
  handleEditCampaign,
  setSelectedData,
  setContentPopup,
  setOpenConfirmPopup,
}) => {
  return (
    <ContainerTable>
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
              campaign={campaign}
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

export default ContainerCampaigns;
