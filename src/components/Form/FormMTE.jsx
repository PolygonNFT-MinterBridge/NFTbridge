import React, { useState, useEffect } from "react";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, CircularProgress } from "@material-ui/core";

// components
import ErrorBox from "../UI/ErrorBox";
import ResultModal from "../UI/ResultModal";

// web3
import CheckMaticConnection from "./CheckConnection/CheckMaticConnection";
import { useWeb3Context } from "../../contexts/Web3Context";
import { childChainPrimaryProvider } from "../../utils/providers";
import { burnERC721 } from "../../utils/erc721";
import { burnBatchERC1155 } from "../../utils/erc1155";
import { getMetadata } from "../../utils/helpers";

const FormMTE = (props) => {
  const classes = useStyles();
  const [triggerModal, setTriggerModal] = useState(false);

  const openModal = () => {
    setTriggerModal(true);
  };

  const { inj_provider, providerChainId, account } = useWeb3Context();

  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [burnAddr, setBurnAddr] = useState("");
  const [burnToken, setBurnToken] = useState([]);
  const [burnTokenAmount, setBurnTokenAmount] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [checkBoxBurn, setCheckBoxBurn] = useState({
    checkedA: false,
    checkedB: false,
  });
  const [previewData, setPreviewData] = useState({
    token_url: "",
    image: "",
    name: "",
    contract_name: "",
    token_id: "",
    description: "",
  });
  
  const [url, setUrl] = useState("https://explorer-mumbai.maticvigil.com/tx/");
  useEffect(() => {
    if (providerChainId === 137) {
      setUrl("https://explorer-mainnet.maticvigil.com/tx/");
    } else {
      setUrl("https://explorer-mumbai.maticvigil.com/tx/");
    }
  }, [providerChainId]);

  useEffect(() => {
    previewData.token_id && props.sendDataToFormSection(previewData);
  });

  const burn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // create pos client insatnce
      // const acc = await inj_provider.eth.getAccounts();
      const maticPOSClient = await childChainPrimaryProvider(inj_provider);
      console.log("got pos", maticPOSClient);

      // filter token id
      let arr = burnToken.split(",").map(function (item) {
        return parseInt(item, 10);
      });
      console.log(arr);

      // burn
      let tx;
      if (checkBoxBurn.checkedA === false) {
        tx = await burnERC721(maticPOSClient, burnAddr, arr);
      } else {
        let amounts = burnTokenAmount.split(",").map(function (item) {
          return parseInt(item, 10);
        });
        tx = await burnBatchERC1155(maticPOSClient, burnAddr, arr, amounts);
      }
      setResult(tx);

      // Update on Firebase 
      let oldData = {
        txn: [],
        nft721: [],
        txnType: [],
        burnedTxn: []
      };
      const snapshot = await props.db.collection('storeHash').doc(account);
      const data = await snapshot.get();
      console.log(data.data());
      if (data.data() !== undefined) {
        oldData = data.data();
      }
      const docRef = props.db.collection("storeHash").doc(account);
      await docRef.set({
        txn: [...oldData.txn, tx],
        nft721: [...oldData.nft721, !checkBoxBurn.checkedA],
        txnType: [...oldData.txnType, 'exit'],
        burnedTxn: [...oldData.burnedTxn, '']
      });

      setLoading(false);
      openModal();
    } catch (e) {
      setError(e.toString());
      if (e.message === "Cannot read property 'eth' of undefined")
        setError("Wallet not Connected");
      else setError(e.message.substr(0, 70));
      console.error(e.message);
      setLoading(false);
    }
  };

  const handleChangeBurn = (event) => {
    setCheckBoxBurn({
      ...checkBoxBurn,
      [event.target.name]: event.target.checked,
    });
  };

  const preview = async (e) => {
    e.preventDefault();
    setPreviewLoading(true);
    try {
      // filter token id
      let arr = burnToken.split(",").map(function (item) {
        return parseInt(item, 10);
      });
      console.log(arr);
      const data = await getMetadata(providerChainId, burnAddr, arr[0]);
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
          "Data for this NFT not found. Make sure you are on Polygon network."
        );
      } else if (e.message === "Cannot read property 'image' of null") {
        setError("");
      } else setError(e.message.substr(0, 70));
      setPreviewLoading(false);
    }
  };

  return (
    <>
      <ResultModal
        maticToEth
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{ url: url, address: result, msg: "Token is successfully burned. Please wait 30-40min to state sync. After that you can call exit from notification." }}
      />
      <CheckMaticConnection />
      <form className={classes.formContainer} onSubmit={burn}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <div className={classes.inputContainer}>
              <label htmlFor="token-address">Token address (on MATIC)</label>
              <input
                type="text"
                placeholder="0xd52a861..."
                value={burnAddr}
                onChange={(e) => setBurnAddr(e.target.value)}
                required
                id="token-address"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.inputContainer}>
              <label htmlFor="token-id">
                Token Ids <span>(without space with comma)</span>
              </label>
              <input
                type="string"
                placeholder="1,2,3"
                value={burnToken}
                onChange={(e) => setBurnToken(e.target.value)}
                required
                id="token-id"
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <p className={classes.label}>NFT Type</p>
            <input
              type="checkbox"
              checked={checkBoxBurn.checkedA}
              onChange={handleChangeBurn}
              name="checkedA"
              id="nft-type-mte"
              hidden
              className={classes.hiddenCheckbox}
            />
            <label htmlFor="nft-type-mte" className={classes.nftType}>
              <div>ERC721</div>
              <div>ERC1155</div>
            </label>
          </Grid>
          {checkBoxBurn.checkedA && (
            <>
              <Grid item xs={12} md={6}>
                <div className={classes.inputContainer}>
                  <label htmlFor="token-amount">
                    Token Amounts <span>(without space, with comma)</span>
                  </label>
                  <input
                    type="string"
                    placeholder="2,1,3"
                    value={burnTokenAmount}
                    onChange={(e) => setBurnTokenAmount(e.target.value)}
                    id="token-amount"
                  />
                </div>
              </Grid>
            </>
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
            Burn
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

export default FormMTE;
