import { Box, Typography, TextField } from "@mui/material";

const CustomInput = ({
  label,
  inputName,
  type,
  handleChange,
  placeholder = "",
  value,
  inputBoxClasses = "",
  inputProps = {}, // Additional input props
  inputBoxSX = {},
  available,
  warning,
  error,
  helperText,
}) => {
  return (
    <Box
      className={inputBoxClasses}
      sx={{
        width: "100%",
        ...inputBoxSX,
      }}
    >
      {label && (
        <Typography
          sx={{
            fontSize: "12px",
            lineHeight: "14.4px",
            color: "text.primary",
            fontWeight: "800",
            mb: "8px",
            textTransform: "uppercase",
          }}
        >
          {label}
        </Typography>
      )}

      {type === "textarea" ? (
        <TextField
          rows={4}
          placeholder={placeholder}
          name={inputName}
          value={value || ""}
          onChange={handleChange}
          sx={{ width: "100%", paddingLeft: 0 }}
          InputProps={inputProps}
          multiline
          error={error}
          helperText={helperText}
        />
      ) : (
        <TextField
          type={type}
          variant="outlined"
          placeholder={placeholder}
          fullWidth
          InputLabelProps={{
            shrink: false,
          }}
          name={inputName}
          value={value || ""}
          onChange={handleChange}
          InputProps={inputProps}
          error={error}
          helperText={helperText}
        />
      )}
    </Box>
  );
};

export default CustomInput;
