import React from "react";
import { utils } from "ethers";

import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";

import { useWeb3Context } from "../../../contexts/Web3Context";

const CheckMaticConnection = () => {
  const classes = useStyles();
  const { providerChainId } = useWeb3Context();

  const metamask_mainnet = () => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: utils.hexValue(137),
          chainName: "Matic Mainnet",
          nativeCurrency: {
            name: "Matic Network",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://rpc-mainnet.maticvigil.com"],
          blockExplorerUrls: ["https://explorer-mainnet.maticvigil.com/"],
        },
      ],
    });
  };

  const metamask_testnet = () => {
    window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: utils.hexValue(80001),
          chainName: "Matic Testnet",
          nativeCurrency: {
            name: "Matic Network",
            symbol: "MATIC",
            decimals: 18,
          },
          rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
          blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
        },
      ],
    });
  };

  return (
    <>
      {providerChainId !== 137 && providerChainId !== 80001 && (
        <div className={classes.msgContainer}>
          <div className={classes.msg}>
            <p className={classes.title}>Message</p>
            <p className={classes.text}>
              To access the MATIC to ETH bridge you need to switch to
              <br />
              <br />
              <Button className={classes.btn} onClick={metamask_mainnet}>
                <img
                  src="img/metamask.svg"
                  alt="metamask"
                  className={classes.metamaskLogo}
                />
                MATIC mainnet
              </Button>{" "}
              or{" "}
              <Button className={classes.btn} onClick={metamask_testnet}>
                <img
                  src="img/metamask.svg"
                  alt="metamask"
                  className={classes.metamaskLogo}
                />
                MATIC testnet
              </Button>
            </p>
          </div>
        </div>
      )}
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.msgStyle,
}));

export default CheckMaticConnection;
