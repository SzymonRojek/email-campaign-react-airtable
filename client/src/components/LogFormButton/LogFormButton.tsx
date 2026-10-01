import { Button } from "@mui/material";

interface LogFormButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
  type?: "submit" | "button";
}

const LogFormButton = ({
  label,
  onClick,
  className,
  disabled,
  "aria-label": ariaLabel,
}: LogFormButtonProps) => (
  <Button
    type="submit"
    onClick={onClick}
    className={className}
    disabled={disabled}
    aria-label={ariaLabel}
  >
    {label}
  </Button>
);

export default LogFormButton;
