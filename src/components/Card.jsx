import React from "react";
import { Contract, contractAddress, web3 } from "../eth/contract";
import {
  Box,
  Tab,
  Tabs,
  Button,
  TextField,
  Icon,
  Dialog,
} from "@material-ui/core";
import QRCode from "qrcode.react";
import QrReader from "react-qr-reader";
import EtherscanLogo from "../assets/etherscanLogo.png";
import EthereumLogo from "../assets/ethereum.svg";
import QRIcon from "../assets/qrIcon.svg";
import TokenIcon from "../assets/image2.png";
import Image1 from "../assets/image1.png";
import MainImage from "../assets/main.png";
import "./style.css";

let address = web3.currentProvider.selectedAddress;

const Card = () => {
  const [tabIndex, setTabIndex] = React.useState(0);
  const [amount, setAmount] = React.useState("");
  const [rate, setRate] = React.useState("");
  const [usd, setUsd] = React.useState("");
  const [approx, setApprox] = React.useState("");
  const [balance, setBalance] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [amountSend, setAmountSend] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [scanData, setScanData] = React.useState("");

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

    if (address) {
      let b = await Contract.methods.balanceOf(address).call();
      b = parseFloat(web3.utils.fromWei(b, "ether")).toFixed(5);
      setBalance(b);
    }
  };

  React.useEffect(() => {
    fetchData();
    setInterval(() => {
      if (address != web3.currentProvider.selectedAddress) {
        address = web3.currentProvider.selectedAddress;
        fetchData();
      }
    }, 1000);
  }, []);

  return (
    <Box
      minWidth={280}
      bgcolor="white"
      borderRadius={25}
      padding={4}
      display="flex"
      marginX={3}
      justifyContent="center"
      mb={3}
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
          <Tab label="Send" />
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
                Claim free XRY Token from Faucet
              </Box>
              <Box my={2} />
              <img draggable={false} width={170} src={MainImage} />
              <Box my={3} />
              <Button
                className="button"
                variant="contained"
                style={{
                  boxShadow: "none",
                  backgroundColor: "#e57373",
                  color: "white",
                  borderRadius: 25,
                  padding: 14,
                  width: 200,
                }}
                onClick={() => {
                  if (!address) return;
                  Contract.methods.claim().send({ from: address });
                }}
              >
                Claim 1 XRY
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
              <Box mt={2}>1 XRY = {rate} ETH</Box>
              <Box mt={1}>1 XRY = {usd} USD</Box>
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
                helperText={approx && `Approximately: ${approx} XRY`}
                placeholder="ETH"
                InputProps={{
                  startAdornment: (
                    <img
                      draggable={false}
                      style={{ marginRight: 5 }}
                      width={14}
                      src={EthereumLogo}
                    ></img>
                  ),
                }}
              ></TextField>
              <Box my={2} />
              <Button
                className="button"
                variant="contained"
                style={{
                  boxShadow: "none",
                  backgroundColor: "#e57373",
                  color: "white",
                  borderRadius: 25,
                  padding: 14,
                  width: 200,
                }}
                color="secondary"
                onClick={() => {
                  if (!address) return;
                  if (!amount || parseFloat(amount) <= 0) return;
                  let weiAmount = web3.utils.toWei(amount, "ether");
                  Contract.methods.buyTokens().send({
                    from: address,
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
                Send ETH to this address in order to receive XRY
              </Box>
              <Box my={2} fontSize={12}>
                {contractAddress}
              </Box>
              <Box>
                <QRCode value={contractAddress}></QRCode>
              </Box>
            </Box>
          )}
          {tabIndex == 2 && (
            <React.Fragment>
              {address ? (
                <Box
                  width={1}
                  height={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexDirection="column"
                >
                  <Box fontSize={26} textAlign="center" width={230}>
                    Balance
                  </Box>
                  <Box mt={2}>{balance} XRY</Box>
                  <Box my={4} />
                  <Box
                    display="flex"
                    alignItems="center"
                    flexDirection="column"
                  >
                    <Box display="flex" alignItems="center">
                      <TextField
                        style={{ width: "120%" }}
                        variant="outlined"
                        value={recipient}
                        onChange={(event) => {
                          let typedRecipient = event.target.value;
                          setRecipient(typedRecipient);
                        }}
                        placeholder="Recipient address"
                      ></TextField>
                      <Box width={10} />
                      <img
                        style={{ cursor: "pointer" }}
                        draggable={false}
                        width={40}
                        src={QRIcon}
                        onClick={() => setOpen(true)}
                      />

                      {/* QR Code Scanner */}
                      <Dialog onClose={() => setOpen(false)} open={open}>
                        <Box width={300} height={300}>
                          <QrReader
                            onScan={(data) => {
                              if (!data) return;
                              setRecipient(data);
                              setOpen(false);
                            }}
                            onError={(error) => console.log(error)}
                            delay={300}
                            style={{ width: "100%" }}
                          ></QrReader>
                        </Box>
                      </Dialog>
                    </Box>
                    <Box height={10} />
                    <TextField
                      style={{ width: 170, borderRadius: 25 }}
                      type="number"
                      variant="outlined"
                      value={amountSend}
                      onChange={(event) => {
                        setAmountSend(event.target.value);
                      }}
                      placeholder="XRY"
                      InputProps={{
                        startAdornment: (
                          <img
                            draggable={false}
                            style={{ marginRight: 5 }}
                            width={14}
                            src={TokenIcon}
                          ></img>
                        ),
                      }}
                    ></TextField>
                    <Box height={10} />

                    <Button
                      className="button"
                      variant="contained"
                      style={{
                        boxShadow: "none",
                        backgroundColor: "#4267B2",
                        color: "white",
                        borderRadius: 25,
                        padding: 14,
                        width: 150,
                      }}
                      color="primary"
                      endIcon={<Icon>send</Icon>}
                      onClick={() => {
                        if (
                          !amountSend ||
                          parseFloat(amountSend) <= 0 ||
                          !web3.utils.isAddress(recipient)
                        )
                          return;
                        let weiAmount = web3.utils.toWei(amountSend, "ether");
                        Contract.methods.transfer(recipient, weiAmount).send({
                          from: address,
                        });
                      }}
                    >
                      Send
                    </Button>
                  </Box>

                  <Box mt={8} mb={1} fontSize={22}>
                    Receive
                  </Box>
                  <Box my={2} fontSize={12}>
                    {address}
                  </Box>
                  <Box>{<QRCode value={address}></QRCode>}</Box>
                </Box>
              ) : (
                <Box width={1} textAlign="center">
                  Connect to Metamask
                </Box>
              )}
            </React.Fragment>
          )}
          <img
            draggable={false}
            style={{ cursor: "pointer", marginTop: 20 }}
            src={EtherscanLogo}
            onClick={() =>
              window.open(
                `https://ropsten.etherscan.io/address/${contractAddress}`
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
