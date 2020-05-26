import React from "react";
import Card from "./components/Card";
import DappInfo from "./components/DappInfo";
import { Box, createMuiTheme, ThemeProvider } from "@material-ui/core";

const theme = createMuiTheme({
  props: {
    // Name of the component ⚛️
    MuiButtonBase: {
      // The properties to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <React.Fragment>
        <Box
          width={1}
          height="100vh"
          display="flex"
          alignItems="center"
          flexDirection="column"
        >
          <Box mt={10} mb={8} color="white" fontSize={40}>
            AllyFocus
          </Box>

          <Card />
        </Box>
        <DappInfo />
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
