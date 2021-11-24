import PropTypes from "prop-types";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const CustomButton = styled(Button)(({ bgc, hover }) => ({
  ":hover": {
    backgroundColor: hover,
  },
  color: "white",
  backgroundColor: bgc,
  minWidth: 120,
  fontSize: 18,
  letterSpacing: 2,
  margin: "20px 0",
}));

const StyledButton = ({ bgc, hover, ariaLabel, label, type }) => (
  <CustomButton bgc={bgc} hover={hover} aria-label={ariaLabel} type={type}>
    {label}
  </CustomButton>
);

StyledButton.propTypes = {
  bgc: PropTypes.string.isRequired,
  hover: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default StyledButton;
