import { useNavigate } from "react-router-dom";
import { Button, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import successIcon from "./success.png";

import {
  isEven,
  getFormattedData,
  getStatusColor,
  capitalizeFirstLetter,
} from "../../helpers";

const useStyles = makeStyles((theme) => ({
  status: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "#ddd",
    borderRadius: 8,
    padding: "3px 10px",
    display: "inline-block",
  },
}));

const RowCampaign = (props) => {
  const {
    campaign,
    index,
    children,
    setIdClickedItem,
    handleDraftCampaign,
    setOpenConfirmPopup,
    setContentPopup,
  } = props;
  const navigate = useNavigate();
  const classes = useStyles();

  return (
    <TableRow
      key={`${campaign.id}`}
      sx={{
        "&:last-child td, &:last-child th": { border: 0 },
      }}
      style={{ backgroundColor: isEven(index, "#F5F5F5") }}
    >
      {children}
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {capitalizeFirstLetter(campaign.fields.title)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {campaign.fields.description}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="body2">
          {getFormattedData(campaign.createdTime)}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{
              backgroundColor: getStatusColor(campaign.fields.status),
            }}
          >
            {campaign.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        {campaign.fields.status === "draft" ? (
          <Button
            aria-label="edit"
            color="success"
            variant="contained"
            onClick={() => {
              handleDraftCampaign(campaign.id);
              navigate(`/campaigns/${campaign.id}`);
            }}
          >
            Edit
          </Button>
        ) : (
          <div>
            <Tooltip title="No edit" placement="right-start">
              <img
                src={successIcon}
                alt="success-icon"
                style={{ height: "50px", width: "50px" }}
              />
            </Tooltip>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Button
          aria-label="delete"
          color="error"
          variant="contained"
          startIcon={<DeleteIcon style={{ marginLeft: 10 }} />}
          onClick={() => {
            setOpenConfirmPopup(true);
            setIdClickedItem(campaign.id);
            setContentPopup({
              title: "Are you sure you want to remove this email campaign?",
            });
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default RowCampaign;

/*

--> kiedy kliknę w "edit" mam przenieść się do edytowanego formularzu:
- dane są widoczne w polach formularzu;
- mam dostęp do edytowanego obiektu;
- po wysłaniu edytuje istniejący obiekt, więc muszę uwzględnić metodę PATCH,
czyli muszę sprawdzić czy pole formularza jest puste lub nie jest
i zaktualizować obiekt;

kiedy klikam w edit otrzymuję ponownie istniejący obiekt
ustawiam wartości formularza
poprzez naciśnięcie send uaktualniam obiekt

*/
