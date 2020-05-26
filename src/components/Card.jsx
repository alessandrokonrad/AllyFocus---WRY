import React from "react";
import { Contract, contractAddress, web3 } from "../eth/contract";
import { Box, Tab, Tabs, Button, TextField } from "@material-ui/core";
import QRCode from "qrcode.react";
import EtherscanLogo from "../assets/etherscanLogo.png";

const Card = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [amount, setAmount] = React.useState("");
  const [rate, setRate] = React.useState("");
  const [usd, setUsd] = React.useState("");
  const [approx, setApprox] = React.useState("");

  const fetchData = async () => {
    let r = await Contract.methods.getExchangeRate().call();
    r = parseFloat(web3.utils.fromWei(r, "ether"));

    let ticker = await fetch(
      `https://api.coinpaprika.com/v1/tickers/eth-ethereum`
    ).then((res) => res.json());
    let ethusd = parseFloat(ticker.quotes.USD.price);
    let usdPrice = ethusd * r;
    setUsd(usdPrice.toFixed(5));
    setRate(r.toFixed(5));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box
      bgcolor="white"
      borderRadius={25}
      padding={4}
      display="flex"
      justifyContent="center"
    >
      <Box width={1}>
        <Tabs
          variant="fullWidth"
          value={tabIndex}
          onChange={(e, newValue) => setTabIndex(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Claim" />
          <Tab label="Swap" />
        </Tabs>
        <Box mt={7}>
          {tabIndex == 0 && (
            <Box
              width={1}
              height={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box fontSize={26} textAlign="center" width={230}>
                Claim free WRY Token from Faucet
              </Box>
              <Box my={3} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  Contract.methods.totalSupply().call().then(console.log);
                  Contract.methods
                    .claim()
                    .send({ from: web3.currentProvider.selectedAddress });
                }}
              >
                Claim 1 WRY
              </Button>
            </Box>
          )}
          {tabIndex == 1 && (
            <Box
              width={1}
              height={1}
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Box fontSize={26} textAlign="center" width={230}>
                Exchange Rate
              </Box>
              <Box mt={2}>1 WRY = {rate} ETH</Box>
              <Box mt={1}>1 WRY = {usd} USD</Box>
              <Box my={2} />
              <TextField
                variant="outlined"
                type="number"
                value={amount}
                onChange={(event) => {
                  let typedAmount = event.target.value;
                  setAmount(typedAmount);
                  let calculated = parseFloat(typedAmount) / parseFloat(rate);
                  if (Number(calculated)) setApprox(calculated);
                  else setApprox("");
                }}
                helperText={approx && `Approximately: ${approx} WRY`}
                placeholder="ETH"
                help
              ></TextField>
              <Box my={2} />
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => {
                  let weiAmount = web3.utils.toWei(amount, "ether");
                  Contract.methods.totalSupply().call().then(console.log);
                  Contract.methods.buyTokens().send({
                    from: web3.currentProvider.selectedAddress,
                    value: weiAmount,
                  });
                }}
              >
                Buy
              </Button>

              <Box mt={4} mb={3} fontSize={22}>
                OR
              </Box>
              <Box my={1} width={220} fontSize={14} textAlign="center">
                Send ETH to this address in order to receive WRY
              </Box>
              <Box my={2} fontSize={12}>
                {contractAddress}
              </Box>
              <Box>
                <QRCode value={contractAddress}></QRCode>
              </Box>
            </Box>
          )}
          <img
            style={{ cursor: "pointer", marginTop: 20 }}
            src={EtherscanLogo}
            onClick={() =>
              window.open(
                "https://ropsten.etherscan.io/address/0xf3c2dae52e16a516656864e3a17f1e8effe5fb4b"
              )
            }
            width={25}
          ></img>
        </Box>
      </Box>
    </Box>
  );
};

export default Card;
