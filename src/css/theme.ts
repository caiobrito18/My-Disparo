import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#8130f1",
      dark: "#4600bd",
      light: "#b863ff",
      contrastText: "##ffffff"
    },
    secondary: {
      main: "#001b2e",
      dark: "#000005",
      light: "#2b4157",
      contrastText: "##ffffff"
    },
    text: {
      primary: "#eaeaea",
      secondary: "#c8c8c8",
      disabled: "#a6a6a6"
    }
  }
}
);
