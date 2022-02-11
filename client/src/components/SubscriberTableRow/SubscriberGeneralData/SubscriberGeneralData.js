import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { TableCell, TableRow, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import {
  isEven,
  getFormattedData,
  getStatusColor,
  capitalizeFirstLetter,
} from "helpers";
import { usePopup } from "popupContext";

const styles = {
  button: {
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "white",
  },
  paragraph: {
    padding: "8px 20px",
    letterSpacing: 2,
    textTransform: "uppercase",
    fontSize: 11,
    width: 80,
    display: "flex",
    justifyContent: "center",
  },
  icon: { marginLeft: 10, color: "white" },
};

const useStyles = makeStyles((theme) => ({
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
}));

const SubscriberGeneralData = (props) => {
  const {
    subscriber,
    index,
    actualPage,
    dataPerPage,
    editSubscriber,
    handleSubscriberDetails,
    removeSubscriber,
  } = props;

  const [modifyData, setModifyData] = useState({
    name: "",
    surname: "",
    statusColor: "",
    formattedData: "",
  });

  useEffect(() => {
    setModifyData({
      name: subscriber ? capitalizeFirstLetter(subscriber.fields.name) : "",
      surname: subscriber
        ? capitalizeFirstLetter(subscriber.fields.surname)
        : "",
      statusColor: subscriber ? getStatusColor(subscriber.fields.status) : "",
      formattedData: subscriber ? getFormattedData(subscriber.createdTime) : "",
    });
  }, [subscriber]);

  const navigate = useNavigate();
  const classes = useStyles();
  const location = useLocation();
  const [indexPage] = useState(actualPage);

  const { openInfoPopup, openConfirmPopup, addTextPopup, handleActionPopup } =
    usePopup();

  const setTextPopupByStatus = (subscriber) => {
    const styles = {
      pending: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
      blocked: { color: "#d32f2f", fontWeight: "bold", letterSpacing: 2 },
      name: { color: "green", fontWeight: "bold", letterSpacing: 2 },
    };
    if (subscriber.fields.status === "pending") {
      addTextPopup({
        title: <span style={styles.pending}>Please wait...</span>,
        mainText: (
          <>
            <span style={styles.name}>{modifyData.name}'s</span>
            status is
            <span style={styles.pending}> pending </span> at the moment because
            you need to complete all data in the table
          </>
        ),
        colorButton: "error",
      });

      openInfoPopup();
    } else if (subscriber.fields.status === "blocked") {
      addTextPopup({
        title: <span style={styles.blocked}>Unfortunately...</span>,
        mainText: (
          <>
            <span style={styles.name}>{modifyData.name}'s</span>
            status is
            <span style={styles.blocked}> blocked </span>can not get an access
            to more details 🙁
          </>
        ),
        colorButton: "error",
      });

      openInfoPopup();
    }
  };

  return (
    <TableRow
      className="table-row"
      key={`key-${subscriber.id}`}
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
          {modifyData.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {modifyData.surname}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{
              backgroundColor: modifyData.statusColor,
              ...styles.paragraph,
            }}
          >
            {subscriber.fields.status}
          </Typography>
        </span>
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
      {location.pathname === "/subscribers" ||
      location.pathname === "/subscribers/status" ? (
        <>
          <TableCell>
            <Button
              style={styles.button}
              aria-label="edit"
              color="success"
              variant="contained"
              startIcon={<FaUserEdit style={styles.icon} />}
              onClick={() => {
                editSubscriber(subscriber);
                navigate(`/subscribers/edit/${subscriber.id}`);
              }}
            ></Button>
          </TableCell>
          <TableCell>
            <Button
              aria-label="subscriber-details"
              color="success"
              variant="contained"
              startIcon={<CgDetailsMore style={styles.icon} />}
              onClick={() => {
                handleSubscriberDetails(subscriber);
                setTextPopupByStatus(subscriber);
              }}
            />
          </TableCell>
          <TableCell>
            <Button
              key={location.key}
              aria-label="delete"
              color="error"
              variant="contained"
              startIcon={<MdPersonRemoveAlt1 style={styles.icon} />}
              onClick={() => {
                handleActionPopup(() => ({
                  change: () => removeSubscriber(subscriber.id, "subscribers"),
                }));
                addTextPopup({
                  question: (
                    <>
                      Are you sure you want to remove{" "}
                      <span style={{ color: "crimson", fontWeight: "bold" }}>
                        {modifyData.name}
                      </span>
                      ?
                    </>
                  ),
                });
                openConfirmPopup();
              }}
            />
          </TableCell>
        </>
      ) : (
        []
      )}
    </TableRow>
  );
};

SubscriberGeneralData.propTypes = {
  subscriber: PropTypes.shape({
    id: PropTypes.string,
    createdTime: PropTypes.string,
    fields: PropTypes.shape({
      status: PropTypes.string,
      name: PropTypes.string,
      surname: PropTypes.string,
      profession: PropTypes.string,
      email: PropTypes.string,
      salary: PropTypes.string,
      telephone: PropTypes.string,
    }),
  }),
  index: PropTypes.number,
  actualPage: PropTypes.number,
  dataPerPage: PropTypes.number,
  editSubscriber: PropTypes.func,
  handleSubscriberDetails: PropTypes.func,
  removeSubscriber: PropTypes.func,
};

export default SubscriberGeneralData;
