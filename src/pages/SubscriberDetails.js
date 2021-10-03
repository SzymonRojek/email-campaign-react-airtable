import { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Grid,
  Typography,
} from "@material-ui/core";

import { getFormattedData, getStatusColor } from "./../helpers";
import api from "../api";

const useStyles = makeStyles((theme) => ({
  tableContainer: {
    borderRadius: 15,
    margin: "10px 10px",
    maxWidth: 950,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.getContrastText(theme.palette.primary.dark),
  },
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

const SubscriberDetails = ({ match }) => {
  const [subscriber, setSubscriber] = useState([]);

  const classes = useStyles();

  const id = match.params.id;
  const endpoint = `/subscribers/${id}`;

  const getSubscriber = async () => {
    const data = await api.get(endpoint);
    setSubscriber([data]);
  };

  useEffect(() => {
    getSubscriber();
  }, []);

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.tableHeaderCell}>Name</TableCell>
            <TableCell className={classes.tableHeaderCell}>Surname</TableCell>
            <TableCell className={classes.tableHeaderCell}>Email</TableCell>
            <TableCell className={classes.tableHeaderCell}>Status</TableCell>
            <TableCell className={classes.tableHeaderCell}>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subscriber &&
            subscriber.map((data, index) => (
              <TableRow
                key={`id-${data.id}`}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                }}
                className={classes.hover}
              >
                <TableCell>
                  <Grid container alignItems="center">
                    <Grid item sm={4}>
                      <Avatar
                        alt={`Image of ${data.fields.name}'s`}
                        style={{
                          backgroundColor: getStatusColor(data.fields.status),
                        }}
                      >
                        {data.fields.name[0]}
                      </Avatar>
                    </Grid>
                    <Grid item>
                      <Typography color="textSecondary" variant="body2">
                        {data.fields.name}
                      </Typography>
                    </Grid>
                  </Grid>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {data.fields.surname}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {data.fields.email}
                  </Typography>
                </TableCell>
                <TableCell>
                  <span>
                    <Typography
                      key={index}
                      className={classes.status}
                      style={{
                        backgroundColor: getStatusColor(data.fields.status),
                      }}
                    >
                      {data.fields.status}
                    </Typography>
                  </span>
                </TableCell>
                <TableCell>
                  <Typography color="textSecondary" variant="body2">
                    {getFormattedData(data.createdTime)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubscriberDetails;
