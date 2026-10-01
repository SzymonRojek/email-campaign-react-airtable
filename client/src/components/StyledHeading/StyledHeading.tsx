import { useStyles } from "./styles";

const StyledHeading = ({ label }: { label: string }) => {
  const classes = useStyles();

  return <h1 className={classes.heading}>{label}</h1>;
};

export default StyledHeading;
