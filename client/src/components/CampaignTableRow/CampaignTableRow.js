import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, Zoom } from "@mui/material";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { FaRegEdit } from "react-icons/fa";
import { MdEditOff, MdDeleteSweep } from "react-icons/md";

import {
  isEven,
  getFormattedData,
  getStatusColor,
  capitalizeFirstLetter,
} from "helpers";
import { usePopup } from "popupContext";

const styles = {
  typography: {
    padding: "8px 20px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
    width: 80,
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
  questionText: { color: "crimson", fontWeight: "bold" },
};

const useStyles = makeStyles(() => ({
  status: {
    fontWeight: "bold",
    fontSize: "0.75rem",
    color: "white",
    backgroundColor: "#ddd",
    borderRadius: 4,
    padding: "5px 10px",
    display: "inline-block",
  },
  cellNo: { width: 25 },
  cell: { wordWrap: "break-word", width: 100 },
  disableButton: {
    "&.MuiButton-root.MuiButton-contained": { backgroundColor: "#b3b3b3" },

    "&:hover": {
      backgroundColor: "#b3b3b3",
    },
  },
}));

const CampaignTableRow = (props) => {
  const {
    campaign,
    index,
    actualPage,
    dataPerPage,
    editCampaign,
    removeCampaign,
  } = props;

  const navigate = useNavigate();
  const classes = useStyles();
  const [indexPage] = useState(actualPage);
  const { openConfirmPopup, addTextPopup, handleActionPopup } = usePopup();

  const [modifyData, setModifyData] = useState({
    title: "",
    description: "",
    statusColor: "",
    formattedData: "",
  });

  useEffect(() => {
    setModifyData({
      title: campaign ? capitalizeFirstLetter(campaign.fields.title) : "",
      description: campaign
        ? capitalizeFirstLetter(campaign.fields.description)
        : "",
      statusColor: campaign ? getStatusColor(campaign.fields.status) : "",
      formattedData: campaign ? getFormattedData(campaign.createdTime) : "",
    });
  }, [campaign]);

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
          {modifyData.title}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {modifyData.description}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {modifyData.formattedData}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{
              backgroundColor: modifyData.statusColor,
              ...styles.typography,
            }}
          >
            {campaign.fields.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        {campaign.fields.status === "draft" ? (
          <Button
            style={styles.button}
            aria-label="edit"
            color="success"
            variant="contained"
            startIcon={<FaRegEdit style={styles.icon} />}
            onClick={() => {
              editCampaign(campaign);
              navigate(`/campaigns/edit/${campaign.id}`);
            }}
          ></Button>
        ) : (
          <Tooltip
            title="already sent"
            placement="right-start"
            TransitionComponent={Zoom}
          >
            <Button
              style={styles.button}
              aria-label="edit off"
              className={classes.disableButton}
              variant="contained"
              startIcon={<MdEditOff style={styles.icon} />}
            ></Button>
          </Tooltip>
        )}
      </TableCell>
      <TableCell>
        <Button
          aria-label="delete"
          color="error"
          variant="contained"
          startIcon={<MdDeleteSweep style={styles.icon} />}
          onClick={() => {
            handleActionPopup(() => ({
              change: () => removeCampaign(campaign.id, "campaigns"),
            }));
            addTextPopup({
              question: (
                <>
                  Are you sure you want to remove{" "}
                  <span style={styles.questionText}>{modifyData.title}</span>?
                </>
              ),
            });
            openConfirmPopup();
          }}
        />
      </TableCell>
    </TableRow>
  );
};

CampaignTableRow.propTypes = {
  campaign: PropTypes.shape({
    id: PropTypes.string,
    createdTime: PropTypes.string,
    fields: PropTypes.shape({
      status: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
    }),
  }),
  index: PropTypes.number,
  actualPage: PropTypes.number,
  dataPerPage: PropTypes.number,
  editCampaign: PropTypes.func,
  removeCampaign: PropTypes.func,
};

export default CampaignTableRow;
