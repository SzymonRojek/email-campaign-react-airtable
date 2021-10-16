import { useLocation } from "react-router-dom";
import { Button } from "@mui/material";
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
    setOpenConfirmPopup,
    setIdClickedItem,
    setContentPopup,
  } = props;
  const classes = useStyles();

  //   const location = useLocation();
  //   console.log(campaign);
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
          {campaign.fields.content}
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
            // onClick={() => {
            //   setOpenConfirmPopup(true);
            //   setIdClickedItem(campaign.id);
            // }}
          >
            Edit
          </Button>
        ) : (
          <div>
            <img
              src={successIcon}
              alt="success-icon"
              style={{ height: "50px", width: "50px" }}
            />
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
