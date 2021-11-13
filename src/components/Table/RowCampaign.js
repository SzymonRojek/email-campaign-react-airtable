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

const typographyStyles = {
  padding: "9px 20px",
  letterSpacing: 2,
  textTransform: "uppercase",
  fontSize: 11,
  width: 60,
  display: "flex",
  justifyContent: "center",
};

const buttonStyles = {
  fontSize: 12,
  letterSpacing: 2,
  fontWeight: "bold",
};

const useStyles = makeStyles(() => ({
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
    setSelectedData,
    handleEditCampaign,
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
        <Typography color="textSecondary" variant="subtitle1">
          {capitalizeFirstLetter(campaign.fields.title)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle1">
          {campaign.fields.description}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography color="textSecondary" variant="subtitle1">
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
              ...typographyStyles,
            }}
          >
            {campaign.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        {campaign.fields.status === "draft" ? (
          <Button
            style={{ ...buttonStyles }}
            aria-label="edit"
            color="success"
            variant="contained"
            onClick={() => {
              handleEditCampaign(campaign.id);
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
            setSelectedData(campaign);
            setContentPopup({
              title: capitalizeFirstLetter(campaign.fields.title),
            });
          }}
        />
      </TableCell>
    </TableRow>
  );
};

export default RowCampaign;
