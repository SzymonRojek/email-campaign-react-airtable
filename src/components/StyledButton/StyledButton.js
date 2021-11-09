import { Button } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    border: 0,
    borderRadius: 3,
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    minHeight: 60,
    width: "100%",
  },
}));

const StyledButton = ({ type, onClick, ariaLabel, label }) => {
  const classes = useStyles();
  return (
    <Button
      style={{ color: "white" }}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
      className={classes.root}
    >
      {label}
    </Button>
  );
};

export default StyledButton;
