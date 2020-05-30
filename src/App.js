import React from "react";
import Card from "./components/Card";
import DappInfo from "./components/DappInfo";
import { Box, createMuiTheme, ThemeProvider } from "@material-ui/core";
import Image1 from "./assets/image1.png";
import TokenIcon from "./assets/image2.png";

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
          <Box
            mt={5}
            mb={8}
            color="white"
            fontSize={40}
            display="flex"
            alignItems="center"
          >
            <img width={50} src={TokenIcon}></img>
            <Box width={20} />
            <Box fontWeight="bold">AllyFocus</Box>
            <Box width={10} />
            <img width={80} src={Image1}></img>
          </Box>

          <Card />
        </Box>

        <DappInfo />
      </React.Fragment>
    </ThemeProvider>
  );
}

export default App;
