import { FormControlLabel, Checkbox } from "@mui/material";

const StyledCheckbox = ({ sx, style, label, onChange, defaultValue }) => (
  <FormControlLabel
    control={
      <Checkbox sx={sx} defaultValue={defaultValue} onChange={onChange} />
    }
    label={<span style={style}>{label}</span>}
  />
);

export default StyledCheckbox;
