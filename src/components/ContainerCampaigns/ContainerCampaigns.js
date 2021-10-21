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
  handleDraftCampaign,
  setIdClickedItem,
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
              handleDraftCampaign={handleDraftCampaign}
              index={index}
              setOpenConfirmPopup={setOpenConfirmPopup}
              setIdClickedItem={setIdClickedItem}
              setContentPopup={setContentPopup}
            />
          ))}
      </BodyTable>
    </ContainerTable>
  );
};

export default ContainerCampaigns;
