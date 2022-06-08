import { makeStyles } from "@material-ui/core/styles";

export const useSelectStylesContainer = makeStyles({
  root: {
    "& .MuiOutlinedInput-input": {
      color: "white",
      padding: "5px 12px",
      backgroundColor: "#142f43",
      minWidth: 20,
    },
    "& .MuiInputLabel-root": {
      color: "white",
    },
    "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
      borderColor: "#142f43",
      border: "none",
    },
    "& .MuiSvgIcon-root": {
      color: "white",
    },
  },
});

export const stylesContainer = {
  headerWrapper: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 20px",
  },
  title: {
    fontWeight: 600,
    fontSize: 18,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  selectText: { fontSize: 16, fontWeight: "bold", letterSpacing: 2 },
  select: {
    wrapper: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
  },
  textError: { paddingTop: 0 },
};

export const stylesFooter = {
  footerContainer: {
    textAlign: "center",
    padding: 20,
  },
  text: { fontSize: 24 },
  active: { color: "green", fontWeight: "bold", letterSpacing: 2 },
  pending: { color: "orange", fontWeight: "bold", letterSpacing: 2 },
  blocked: { color: "crimson", fontWeight: "bold", letterSpacing: 2 },
};

export const useStylesHead = makeStyles(() => ({
  tableHeaderCell: {
    minWidth: 100,
    fontWeight: "bold !important",
    backgroundColor: "#142f43 !important",
    color: "rgb(221, 220, 220) !important",
  },
  tableHeader: {
    height: "75.50px",
  },
}));
