import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { FormControl, Select, MenuItem } from "@mui/material";
import { Typography } from "@material-ui/core";

import { useMenuItemStyles } from "./styles";

const SelectInputController = ({ ...props }) => {
  const {
    control,
    name,
    defaultValue,
    error,
    message,
    data,
    classesSelectStyles,
    styles,
  } = props;

  const classesMenuItem = useMenuItemStyles();

  const customId = `${name}-id`;

  return (
    <FormControl fullWidth className={classesSelectStyles}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { ref, value, ...field } }) => (
          <Select
            {...field}
            inputRef={ref}
            id={customId}
            value={value}
            selected={value}
            error={error}
            className={classesSelectStyles}
          >
            {data.map(({ value, label }) => (
              <MenuItem
                key={`key-${label}`}
                value={value}
                className={classesMenuItem.root}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Typography variant="inherit" style={styles}>
        {message}
      </Typography>
    </FormControl>
  );
};

SelectInputController.propTypes = {
  control: PropTypes.object,
  error: PropTypes.bool,
  name: PropTypes.string,
  defaultValue: PropTypes.string,
  message: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ),
};

export default SelectInputController;
