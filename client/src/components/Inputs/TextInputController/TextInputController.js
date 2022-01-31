import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import { Typography } from "@mui/material";

import CustomTextInput from "./CustomTextInput";

const stylesError = { color: "crimson", paddingTop: 4 };

const TextInputController = ({
  name,
  control,
  label,
  defaultValue,
  error,
  message,
  rows,
  multiline,
}) => (
  <>
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      rules={{ required: true }}
      render={({ field: { ref, ...field } }) => (
        <CustomTextInput
          {...field}
          inputRef={ref}
          label={label}
          error={error}
          rows={rows}
          multiline={multiline}
        />
      )}
    />

    <Typography variant="inherit" style={stylesError}>
      {message}
    </Typography>
  </>
);

CustomTextInput.propTypes = {
  name: PropTypes.string.isRequired,
  control: PropTypes.object,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string,
  rows: PropTypes.number.isRequired,
  multiline: PropTypes.bool,
};

CustomTextInput.defaultProps = { rows: 5 };

export default TextInputController;
