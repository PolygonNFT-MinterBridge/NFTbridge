import React, { useState } from "react";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import { Button, CircularProgress, Modal } from "@material-ui/core";
import { BlurOnOutlined, Close } from "@material-ui/icons";

// components
import ErrorBox from "../UI/ErrorBox";

// images
import thumbsUp from "../../images/thumbs-up.png";
import HexagonGraphic from "../UI/HexagonGraphic";

// web3
import { useWeb3Context } from "../../contexts/Web3Context";
import { rootChainPrimaryProvider } from "../../utils/providers";
import { exitERC721 } from "../../utils/erc721";
import { exitERC1155 } from "../../utils/erc1155";

const ExitModal = ({ triggerModal, setTriggerModal, data, db }) => {
  const classes = useStyles();
  const { inj_provider, providerChainId, account } = useWeb3Context();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(data.burnedTxn);

  const hideModal = () => {
    setTriggerModal(false);
  };

  const exit = async (e) => {
    console.log("Exit function called...");
    e.preventDefault();
    let maticPOSClient;
    try {
      setLoading(true);
      // create pos client insatnce
      maticPOSClient = await rootChainPrimaryProvider(inj_provider);
      console.log("got pos", maticPOSClient);

      // check if checkpointed
      let isProcessed;
      console.log(isProcessed);
      try {
        if (data.nft721) {
          isProcessed = await maticPOSClient.isBatchERC721ExitProcessed(data.txn);
        } else {
          console.log("test3")
          isProcessed = await maticPOSClient.isBatchERC1155ExitProcessed(data.txn);
          let tx;
          tx = await exitERC1155(maticPOSClient, data.txn);
          console.log(tx,"test1");
          // Update on Firebase 
          const snapshot = await db.collection('storeHash').doc(account);
          const d = await snapshot.get();
          const oldData = d.data();
          const newArr = oldData.burnedTxn;
          newArr[data.burnId] = tx
          const docRef = db.collection("storeHash").doc(account);
          await docRef.update({
            burnedTxn: newArr
          });
          setResult(tx);
        }
      } catch (e) {
        console.log(e);
        // checked do transaction
        if (e.message === "Log not found in receipt") {
          let tx;
          if (data.nft721) {
            tx = await exitERC721(maticPOSClient, data.txn);
          } else {
            tx = await exitERC1155(maticPOSClient, data.txn);
          }
          console.log(tx,"test2");

          // Update on Firebase 
          const snapshot = await db.collection('storeHash').doc(account);
          const d = await snapshot.get();
          const oldData = d.data();
          const newArr = oldData.burnedTxn;
          newArr[data.burnId] = tx
          const docRef = db.collection("storeHash").doc(account);
          await docRef.update({
            burnedTxn: newArr
          });

          setResult(tx);
        }
        // Not checkpointed
        else if (
          e.message === "Burn transaction has not been checkpointed as yet"
        ) {
          console.log("not yet checkpointed");
          setError(`${e.message}yo`);
        } else {
          setError(`${e.message}hello`);
        }
      }
      setLoading(false);
    } catch (e) {
      setError(e.toString());
      if (e.message === "Cannot read property 'eth' of undefined")
        setError("Wallet not Connected");
      else if (
        e.message.substr(0, 60) ===
        "execution reverted: RootChainManager: EXIT_ALREADY_PROCESSED"
      )
        setError("EXIT ALREADY PROCESSED");
      else setError(e.message.substr(0, 70));
      // console.log(e.message.substr(0, 63));
      setLoading(false);
    }
  };


  return (
    <>
      <Modal
        open={triggerModal}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        className={classes.modalContainer}
      >
        <div
          className={classes.modal}
          style={{ paddingTop: "20px", paddingBottom: "30px" }}
        >
          <div className={classes.closeModal} onClick={hideModal}>
            <Close style={{ fontSize: "16px" }} />
          </div>
          {!result && (
            <form className={classes.notificationForm}>
              <h3 className={classes.title}>Exit Transaction</h3>
              <div className={classes.inputContainer}>
                <label htmlFor="txn">Transaction Hash</label>
                <input
                  type="string"
                  placeholder="0xE550A9B2A6B8e0F79C6E0397Ff7Bc2F6c0F..."
                  value={data.txn}
                  required
                  id="txn"
                  readOnly
                  style={{ pointerEvents: "none" }}
                />
              </div>
              {/* This input is hidden. */}
              <div className={classes.inputContainer}>
                <label>
                  NFT Type - <span>{data.nft721 ? "ERC721" : "ERC1155"}</span>
                </label>
                <input type="checkbox" hidden disabled />
              </div>
              <div className={classes.btnContainer}>
                <Button
                  className={`${classes.btn} ${classes.filled}`}
                  disabled={loading}
                  onClick={exit}
                >
                  {loading && (
                    <CircularProgress
                      className={`${classes.loading}`}
                      size={24}
                    />
                  )}
                  Exit
                </Button>
              </div>
              {/* error display */}
              {error && <ErrorBox message={error} />}
            </form>
          )}

          {/* result */}
          {result && (
            <div className={classes.successMsg}>
              <h3 className={classes.title} style={{ marginBottom: "60px" }}>
                Exit Successfully
              </h3>
              <div className={classes.graphicSection}>
                <div className="iconContainer">
                  <img src={thumbsUp} alt="thumb icon" />
                  <HexagonGraphic color="#1DBA2D" />
                </div>
              </div>
              <div
                className={classes.textSection}
                style={{ marginTop: "30px" }}
              >
                <p>
                  Transaction hash:{" "}
                  <span>
                    <a
                      href={providerChainId === 1 ? `https://etherscan.io/tx/${result}` : `https://goerli.etherscan.io/tx/${result}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result}
                    </a>
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  // input and label styling is written in theme.js. Check the overrides object
  ...theme.overrides.formStyle,
  ...theme.overrides.modalStyle,
  purple: {
    color: "#7533E2",
  },
  title: {
    fontSize: "20px",
    margin: "0 0 30px 0",
    textAlign: "center",
  },
  successMsg: {
    "& img": {
      margin: "44px auto",
      width: "62px",
    },
  },
}));

export default ExitModal;
