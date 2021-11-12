import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";

const CssButton = styled(Button)(({ backgroundColor, onHover }) => ({
  ":hover": {
    backgroundColor: onHover,
  },
  color: "white",
  backgroundColor: backgroundColor,
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
  backgroundColor,
  onHover,
}) => {
  return (
    <CssButton
      onHover={onHover}
      backgroundColor={backgroundColor}
      type={type}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {label}
    </CssButton>
  );
};
export default StyledButton;
