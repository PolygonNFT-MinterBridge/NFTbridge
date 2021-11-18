import React, { useState, useEffect } from "react";
import CheckEthConnection from "./CheckConnection/CheckEthConnection";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, CircularProgress } from "@material-ui/core";

// components
import ErrorBox from "../UI/ErrorBox";
import ResultModal from "../UI/ResultModal";

// web3
import { useWeb3Context } from "../../contexts/Web3Context";
import { rootChainPrimaryProvider } from "../../utils/providers";
import { approveERC721, depositERC721 } from "../../utils/erc721";
import { approveERC1155, depositERC1155 } from "../../utils/erc1155";
import { getMetadata } from "../../utils/helpers";
import DummyERC721 from "../../utils/abi/DummyERC721.json";
import DummyERC1155 from "../../utils/abi/DummyERC1155.json";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
toast.configure();

const FormETM = (props) => {
  const classes = useStyles();
  const [triggerModal, setTriggerModal] = useState(false);

  const openModal = () => {
    setTriggerModal(true);
  };

  const { inj_provider, providerChainId, account } = useWeb3Context();

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [tokenAddr, setTokenAddr] = useState("");
  const [recieverAddr, setRecieverAddr] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [previewData, setPreviewData] = useState({
    token_url: "",
    image: "",
    name: "",
    contract_name: "",
    token_id: "",
    description: "",
  });
  const [checkBox, setCheckBox] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");

  useEffect(() => {
    previewData.token_id && props.sendDataToFormSection(previewData);
  });

  const [url, setUrl] = useState("https://goerli.etherscan.io/tx/")
  useEffect(() => {
    if (providerChainId === 1) setUrl("http://etherscan.io/tx/");
    else setUrl("https://goerli.etherscan.io/tx/");
  }, [providerChainId]);

  const approve = async (e) => {
    e.preventDefault();
    try {
      console.log("check approve");
      try {
        setLoading(true);
        let contract, res;
        if (checkBox) {
          contract = await new inj_provider.eth.Contract(DummyERC1155, tokenAddr);
          // operator - posERC721Predicate contract address
          res = await contract.methods.isApprovedForAll(recieverAddr, "0xB19a86ba1b50f0A395BfdC3557608789ee184dC8");
        } else {
          // operator - posERC1155Predicate address 
          contract = await new inj_provider.eth.Contract(DummyERC721, tokenAddr);
          res = await contract.methods.isApprovedForAll(recieverAddr, "0x74D83801586E9D3C4dc45FfCD30B54eA9C88cf9b");
        }
        res = await res.call();
        console.log("isApproved", res);
        if (res) {
          setIsApproved(true);
          toast("Already Approved ✅", { type: "success" });
        } else {
          // if not approved
          let tx;
          if (checkBox) {
            const maticPOSClient = await rootChainPrimaryProvider(inj_provider, tokenAddr);
            tx = await approveERC1155(maticPOSClient, tokenAddr);
          } else {
            const maticPOSClient = await rootChainPrimaryProvider(inj_provider, tokenAddr);
            tx = await approveERC721(maticPOSClient, tokenAddr);
          }
          console.log(tx);
          toast("Approved Successfully ✅", { type: "success" });
          setIsApproved(true);
        }
        setLoading(false);
      } catch (e) {
        setLoading(true);
        console.error(e);
      }
    } catch (e) {
      console.error(e)
    }
  }

  const deposit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      // create pos client insatnce
      const maticPOSClient = await rootChainPrimaryProvider(
        inj_provider,
        tokenAddr
      );
      console.log("got pos client", maticPOSClient);

      // filter token id
      let arr = tokenId.split(",").map(function (item) {
        return parseInt(item, 10);
      });
      console.log(arr);

      //  deposit
      let tx;
      if (!checkBox) {
        tx = await depositERC721(maticPOSClient, tokenAddr, recieverAddr, arr);
      } else {
        console.log("token amount", tokenAmount);
        let amounts = tokenAmount.split(",").map(function (item) {
          return parseInt(item, 10);
        });
        console.log("amount", amounts);
        tx = await depositERC1155(
          maticPOSClient,
          tokenAddr,
          recieverAddr,
          arr,
          amounts
        );
      }
      console.log(tx);

      // Update on Firebase 
      let oldData = {
        txn: [],
        nft721: [],
        txnType: [],
        burnedTxn: []
      };
      const snapshot = await props.db.collection('storeHash').doc(account);
      const data = await snapshot.get();
      // console.log(data.data());
      if (data.data() !== undefined) {
        oldData = data.data();
      }
      const docRef = props.db.collection("storeHash").doc(account);
      await docRef.set({
        txn: [...oldData.txn, tx.transactionHash],
        nft721: [...oldData.nft721, !checkBox],
        txnType: [...oldData.txnType, 'deposit'],
        burnedTxn: [...oldData.burnedTxn, '']
      });

      setLoading(false);
      console.log(tx.transactionHash);
      setResult(tx.transactionHash);
      openModal();
    } catch (e) {
      console.error(e);
      if (e.message === "Cannot read property 'eth' of undefined")
        setError("Wallet not Connected");
      else if (e.message.substr(0, 64) === "execution reverted: ERC721: operator query for nonexistent token")
        setError("Incorrect token id, query for nonexistent token");
      else if (e.message.substr(0, 61) === "execution reverted: ERC721: transfer of token that is not own")
        setError("Transferring a token which does not belong to connected wallet address.")
      else if (e.message.substr(0, 56) === "execution reverted: ERC721: transfer caller is not owner")
        setError("Caller address is not approved. Refresh page to approve.");
      else setError(e.message);
      setLoading(false);
    }
  };

  const preview = async (e) => {
    e.preventDefault();
    setPreviewLoading(true);
    try {
      // filter token id
      let arr = tokenId.split(",").map(function (item) {
        return parseInt(item, 10);
      });
      // console.log(arr);
      const data = await getMetadata(providerChainId, tokenAddr, arr[0]);
      if (data.nft_data[0]) {
        const { contract_name } = data;
        const { token_url, token_id, external_data } = data.nft_data[0];
        setPreviewData({
          token_url,
          token_id,
          contract_name,
          image: external_data?.image,
          name: external_data?.name,
          description: external_data?.description,
        });
      }
      setPreviewLoading(false);
    } catch (e) {
      console.error(e.message);
      if (e.message === "Cannot read property 'nft_data' of undefined") {
        setError(
          "Data for this NFT not found. Make sure you are on Eth or Goerli Network."
        );
      } else if (e.message === "Request failed with status code 500") {
        setError(
          "Data for this NFT not found. Make sure you are on Eth or Goerli Network."
        );
      } else setError(e.message.substr(0, 70));
      setPreviewLoading(false);
    }
  };


  return (
    <>
      <ResultModal
        ethToMatic
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{
          url: url,
          addressTwo: result,
          msg: "Please wait. It takes 5-8 minutes to state sync with Polygon. Once state sync happens, you will get the tokens deposited on child chain at the given address.",
        }}
      />
      <CheckEthConnection />
      <form className={classes.formContainer} onSubmit={isApproved ? deposit : approve}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <div className={classes.inputContainer}>
              <label htmlFor="token-address">Token Address (ETH)</label>
              <input
                type="text"
                // className={`${errors.name ? classes.inputErr : ""}`}
                value={tokenAddr}
                onChange={(e) => setTokenAddr(e.target.value)}
                required
                name="token-address"
                id="token-address"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.inputContainer}>
              <label htmlFor="receiver-address">
                Receiver Address (Child Chain)
              </label>
              <input
                type="text"
                // className={`${errors.name ? classes.inputErr : ""}`}
                value={recieverAddr}
                onChange={(e) => setRecieverAddr(e.target.value)}
                required
                name="receiver-address"
                id="receiver-address"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.inputContainer}>
              <label htmlFor="token-ids">
                Token IDs <span>(without space, with commas)</span>
              </label>
              <input
                type="string"
                placeholder="1,2,3"
                // className={`${errors.name ? classes.inputErr : ""}`}
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                required
                name="token-ids"
                id="token-ids"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <p className={classes.label}>NFT Type</p>
            <input
              type="checkbox"
              checked={checkBox}
              onChange={(e) => setCheckBox(e.target.checked)}
              id="checkedA"
              hidden
              className={classes.hiddenCheckbox}
            />
            <label htmlFor="checkedA" className={classes.nftType}>
              <div>ERC721</div>
              <div>ERC1155</div>
            </label>
          </Grid>
          {checkBox && (
            <Grid item xs={12} md={6}>
              <div className={classes.inputContainer}>
                <label htmlFor="token-amount">
                  Token Amount <span>(without space, with commas)</span>
                </label>
                <input
                  type="string"
                  placeholder="2,1,3"
                  // className={`${errors.name ? classes.inputErr : ""}`}
                  value={tokenAmount}
                  onChange={(e) => setTokenAmount(e.target.value)}
                  name="token-amount"
                  id="token-amount"
                />
              </div>
            </Grid>
          )}
        </Grid>

        <div className={classes.btnContainer}>
          <Button type="submit" className={classes.btn} disabled={loading}>
            {loading && (
              <CircularProgress
                className={`${classes.loading} ${classes.purple}`}
                size={24}
              />
            )}
            {isApproved ? 'Deposit' : 'Approve'}
          </Button>
          <Button
            className={`${classes.btn} ${classes.filled}`}
            disabled={previewLoading}
            onClick={preview}
          >
            {previewLoading && (
              <CircularProgress className={`${classes.loading}`} size={24} />
            )}
            Preview
          </Button>
        </div>
        {/* error display */}
        {error && <ErrorBox message={error} />}
      </form>
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
}));

export default FormETM;
