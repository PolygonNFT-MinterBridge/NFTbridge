import React from "react";

import { makeStyles } from "@material-ui/core/styles";

import { useWeb3Context } from "../../../contexts/Web3Context";

const CheckEthConnection = () => {
  const classes = useStyles();
  const { providerChainId } = useWeb3Context();

  return (
    <>
      {providerChainId !== 5 && providerChainId !== 1 && (
        <div className={classes.msgContainer}>
          <div className={classes.msg}>
            <p className={classes.title}>Message</p>
            <p className={classes.text}>
              To access the ETH to MATIC bridge you need to switch to Eth Mainnet
              or Goerli Testnet.
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

export default CheckEthConnection;
