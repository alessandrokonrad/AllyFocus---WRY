import abi from "./contract.abi";
import Web3 from "web3";
import isDapp from "./dapp";

export var web3;

if (isDapp()) {
  web3 = new Web3(window.web3.currentProvider);
  /* UNCOMMENT THIS TO MAKE IT MAINNET READY */
  // if (!(web3.currentProvider.networkVersion == 1)) {
  //   web3 = new Web3(
  //     new Web3.providers.HttpProvider(
  //       "https://mainnet.infura.io/v3/4c63edab283a4ba1b145a17f095be4e3"
  //     )
  //   );
  // }
} else {
  web3 = new Web3(
    new Web3.providers.HttpProvider(
      // "https://mainnet.infura.io/v3/4c63edab283a4ba1b145a17f095be4e3" UNCOMMENT THIS TO MAKE IT MAINNET READY
      "https://ropsten.infura.io/v3/2956c2b8f34c43e6848bd33a99889f2c" // COMMENT THIS OUT ON MAINNET RELEASE
    )
  );
}

export let checkNetwork = () => {
  if (!isDapp()) return true;
  let netId = window.web3.currentProvider.networkVersion;
  if (netId == 1) {
    return true;
  }
  return false;
};

export const contractAddress = "0x366C3436fA5078435c40341E355Ea7491bd415f4";
export const Contract = new web3.eth.Contract(abi, contractAddress);
