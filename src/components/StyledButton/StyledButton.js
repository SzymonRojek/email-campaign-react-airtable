import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const CssButton = styled(Button)(({ backgroundcolor, hover }) => ({
  ":hover": {
    backgroundColor: hover,
  },
  color: "white",
  backgroundColor: backgroundcolor,
  minWidth: 120,
  fontSize: 18,
  padding: "15px 25px",
  letterSpacing: 2,
  margin: "20px 0",
}));

const StyledButton = ({
  type,
  onClick,
  ariaLabel,
  label,
  hover,
  backgroundcolor,
}) => {
  return (
    <CssButton
      hover={hover}
      backgroundcolor={backgroundcolor}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {label}
    </CssButton>
  );
};
export default StyledButton;
