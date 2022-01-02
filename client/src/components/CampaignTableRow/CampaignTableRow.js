import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, Zoom } from "@mui/material";
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

const style = {
  typography: {
    padding: "9px 20px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
    width: 60,
    display: "flex",
    justifyContent: "center",
  },
  button: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "white",
  },
  icon: { marginLeft: 10 },
  toolip: {
    height: "50px",
    width: "50px",
  },
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
  cellNo: { width: 25 },
  cell: { wordWrap: "break-word", width: 100 },
}));

const RowCampaign = (props) => {
  const {
    campaign,
    index,
    actualPage,
    dataPerPage,
    setSelectedData,
    handleEditDetailsCampaign,
    setOpenConfirmPopup,
    setContentPopup,
  } = props;
  const navigate = useNavigate();
  const classes = useStyles();
  const [indexPage] = useState(actualPage);

  return (
    <TableRow
      key={`${campaign.id}`}
      style={{
        backgroundColor: isEven(index, "#F5F5F5"),
        animation: `fadeIn 0.3s ease-in-out  forwards`,
      }}
    >
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cellNo}
        >
          {(indexPage - 1) * dataPerPage + index + 1}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {capitalizeFirstLetter(campaign.fields.title)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {campaign.fields.description}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
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
              ...style.typography,
            }}
          >
            {campaign.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        {campaign.fields.status === "draft" ? (
          <Button
            style={style.button}
            aria-label="edit"
            color="success"
            variant="contained"
            onClick={() => {
              handleEditDetailsCampaign(campaign);
              navigate(`/campaigns/${campaign.id}`);
            }}
          >
            Edit
          </Button>
        ) : (
          <div>
            <Tooltip
              title="No edit"
              placement="right-start"
              TransitionComponent={Zoom}
            >
              <img src={successIcon} alt="success-icon" style={style.toolip} />
            </Tooltip>
          </div>
        )}
      </TableCell>
      <TableCell>
        <Button
          aria-label="delete"
          color="error"
          variant="contained"
          startIcon={<DeleteIcon style={style.icon} />}
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

RowCampaign.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
    createdTime: PropTypes.string.isRequired,
    fields: PropTypes.shape({
      status: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }).isRequired,
  }),
  index: PropTypes.number.isRequired,
  setSelectedData: PropTypes.func.isRequired,
  handleEditDetailsCampaign: PropTypes.func.isRequired,
  setOpenConfirmPopup: PropTypes.func.isRequired,
  setContentPopup: PropTypes.func.isRequired,
};

export default RowCampaign;
