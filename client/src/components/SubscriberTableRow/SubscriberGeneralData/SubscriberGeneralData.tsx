import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaUserEdit } from "react-icons/fa";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import { CgDetailsMore } from "react-icons/cg";
import { TableCell, TableRow, Typography } from "@material-ui/core";

import { styles, useStyles } from "./styles";
import { isEven, getStatusColor, formattedData } from "helpers";
import { useInformationModalState } from "contexts/InformationModalContext";
import { useRemoveItem } from "customHooks/useRemoveItem";
import { Subscriber } from "types";

interface SubscriberGeneralDataProps {
  subscriber: Subscriber;
  index: number;
  actualPage: number;
  dataPerPage: number;
  editSubscriber?: (subscriber: Subscriber) => void;
  handleSubscriberDetails?: (subscriber: Subscriber) => void;
}

const SubscriberGeneralData = (props: SubscriberGeneralDataProps) => {
  const {
    subscriber,
    index,
    actualPage,
    dataPerPage,
    editSubscriber,
    handleSubscriberDetails,
  } = props;

  const { handleConfirmModalData } = useRemoveItem(
    "subscribers",
    subscriber.fields?.name,
    subscriber.id
  );

  const { setInformationModalState, setInformationModalText } =
    useInformationModalState();

  const navigate = useNavigate();
  const classes = useStyles();
  const { pathname, key } = useLocation();
  const [indexPage] = useState(actualPage);

  const informationModalProps = {
    colorButton: "error" as const,
    onClose: () => setInformationModalState({ isOpenInformationModal: false }),
  };

  const setConfirmModalDataByStatus = (subscriber: Subscriber) => {
    const styles = {
      pending: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
      blocked: { color: "#d32f2f", fontWeight: "bold", letterSpacing: 2 },
      name: { color: "green", fontWeight: "bold", letterSpacing: 2 },
    } as const;
    if (subscriber.fields.status === "pending") {
      setInformationModalText({
        title: <span style={styles.pending}>Please wait...</span>,
        message: (
          <>
            <span style={styles.name}>{subscriber.fields?.name}'s</span>
            status is
            <span style={styles.pending}> pending </span> at the moment because
            you need to complete all data in the table
          </>
        ),
      });
      setInformationModalState({
        informationModalProps,
        isOpenInformationModal: true,
      });
    } else if (subscriber.fields.status === "blocked") {
      setInformationModalText({
        title: <span style={styles.blocked}>Unfortunately...</span>,
        message: (
          <>
            <span style={styles.name}>{subscriber.fields?.name}'s</span>
            status is
            <span style={styles.blocked}> blocked </span>can not get an access
            to more details 🙁
          </>
        ),
      });
      setInformationModalState({
        informationModalProps,
        isOpenInformationModal: true,
      });
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
          {subscriber.fields?.name}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {subscriber.fields?.surname}
        </Typography>
      </TableCell>
      <TableCell>
        <span>
          <Typography
            key={index}
            className={classes.status}
            style={{
              backgroundColor: getStatusColor(subscriber.fields?.status),
              ...styles.paragraph,
            }}
          >
            {subscriber.fields?.status}
          </Typography>
        </span>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {formattedData.getFormattedDate(
            subscriber.fields.date || subscriber.createdTime
          )}
        </Typography>
      </TableCell>
      <TableCell>
        <Typography
          color="textSecondary"
          variant="subtitle1"
          className={classes.cell}
        >
          {formattedData.getFormattedTime(
            subscriber.fields.date || subscriber.createdTime
          )}
        </Typography>
      </TableCell>
      {pathname === "/subscribers" || pathname === "/subscribers/status" ? (
        <>
          <TableCell>
            <Button
              style={styles.button}
              aria-label="edit"
              color="success"
              variant="contained"
              startIcon={<FaUserEdit style={styles.icon} />}
              onClick={() => {
                editSubscriber?.(subscriber);
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
                handleSubscriberDetails?.(subscriber);
                setConfirmModalDataByStatus(subscriber);
              }}
            />
          </TableCell>
          <TableCell>
            <Button
              key={key}
              aria-label="delete"
              color="error"
              variant="contained"
              startIcon={<MdPersonRemoveAlt1 style={styles.icon} />}
              onClick={() => handleConfirmModalData()}
            />
          </TableCell>
        </>
      ) : (
        []
      )}
    </TableRow>
  );
};

export default SubscriberGeneralData;
