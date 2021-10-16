import { TableCell } from "@material-ui/core";
import { dataHeadEmailTable } from "../../data/dataHeadEmailTable";

import {
  ContainerTable,
  HeadTable,
  BodyTable,
  RowCampaign,
} from "../../components/Table";

const EmailCampaignsList = ({
  campaignsData,
  setIdClickedItem,
  setOpenConfirmPopup,
  setContentPopup,
}) => {
  return (
    <ContainerTable>
      <HeadTable dataHeadTable={dataHeadEmailTable} />
      <BodyTable>
        {campaignsData.data &&
          campaignsData.data.map((campaign, index) => (
            <RowCampaign
              children={
                <TableCell component="th" scope="row">
                  {++index}.
                </TableCell>
              }
              key={`id-${campaign.id}`}
              campaign={campaign}
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

export default EmailCampaignsList;
