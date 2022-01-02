import PropTypes from "prop-types";
import { Controller } from "react-hook-form";

import { FormControl, Select, MenuItem } from "@mui/material";
import { Typography } from "@material-ui/core";

const SelectInputController = ({ ...props }) => {
  const {
    control,
    name,
    error,
    message,
    defaultValue,
    data,
    useStyles,
    styles,
  } = props;
  const classes = useStyles();
  const customId = `${name}-id`;

  return (
    <FormControl fullWidth className={classes.root}>
      <Controller
        control={control}
        name={name}
        defaultValue={defaultValue}
        render={({ field: { ref, value, ...field } }) => {
          return (
            <Select
              {...field}
              inputRef={ref}
              id={customId}
              error={error}
              selected={value}
              value={value}
            >
              {data.map(({ value, label }) => {
                return (
                  <MenuItem
                    key={`key-${label}`}
                    value={value}
                    style={styles.menuItem}
                  >
                    {label}
                  </MenuItem>
                );
              })}
            </Select>
          );
        }}
      />

      <Typography variant="inherit" style={styles.textError}>
        {message}
      </Typography>
    </FormControl>
  );
};

SelectInputController.propTypes = {
  control: PropTypes.object.isRequired,
  error: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  defaultValue: PropTypes.string.isRequired,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
};
export default SelectInputController;

// const SelectInputController = ({ ...props }) => {
//   const { control, name, error, message, defaultValue, data } = props;
//   const classes = useStyles();
//   const customId = `${name}-id`;

//   return (
//     <FormControl fullWidth className={classes.root}>
//       <Controller
//         render={({ field: { ref, ...field } }) => (
//           <Select {...field} inputRef={ref} id={customId} error={error}>
//             {data.map(({ value, label }) => (
//               <MenuItem key={`key-${label}`} value={value}>
//                 {label}
//               </MenuItem>
//             ))}
//           </Select>
//         )}
//         control={control}
//         name={name}
//         defaultValue={defaultValue}
//       />

//       <Typography variant="inherit" style={style.textError}>
//         {message}
//       </Typography>
//     </FormControl>
//   );
// };
