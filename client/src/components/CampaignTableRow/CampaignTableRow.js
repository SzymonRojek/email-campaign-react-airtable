import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Tooltip, Zoom } from "@mui/material";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { FaRegEdit } from "react-icons/fa";
import { MdEditOff, MdDeleteSweep } from "react-icons/md";

import { styles, useStyles } from "./styles";
import {
  isEven,
  formattedData,
  getStatusColor,
  capitalizeFirstLetter,
} from "helpers";
import { useRemoveItem } from "customHooks/useRemoveItem";

const CampaignTableRow = (props) => {
  const { campaign, index, actualPage, dataPerPage, editCampaign } = props;
  const navigate = useNavigate();
  const classes = useStyles();
  const [indexPage] = useState(actualPage);

  const { handleConfirmModalData } = useRemoveItem(
    "campaigns",
    campaign.fields.title,
    campaign.id
  );

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
          {capitalizeFirstLetter(campaign.fields.description)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {formattedData.getFormattedDate(campaign.createdTime)}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {formattedData.getFormattedTime(campaign.createdTime)}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{
              backgroundColor: getStatusColor(campaign.fields.status),
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
          onClick={() => handleConfirmModalData()}
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
};

export default CampaignTableRow;
