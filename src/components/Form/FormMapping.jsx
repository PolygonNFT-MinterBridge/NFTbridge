import React, { useState } from "react";

// material ui
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Button, CircularProgress } from "@material-ui/core";
// components
import ErrorBox from "../UI/ErrorBox";
import ResultModal from "../UI/ResultModal";

// web3
// import { useWeb3Context } from "../../contexts/Web3Context";
// import { childChainPrimaryProvider } from '../utils/providers';
import { checkMapping, getMetadata } from "../../utils/helpers";

const FormMapping = () => {
  const classes = useStyles();
  const [triggerModal, setTriggerModal] = useState(false);

  const openModal = () => {
    setTriggerModal(true);
  };

  const [exitAddr, setExitAddr] = useState("");
  const [mapped, setMapped] = useState(null);
  const [mappedAddr, setMappedAddr] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkBox, setCheckBox] = useState({
    checkedA: false,
    checkedB: false,
  });

  const check = async (e) => {
    e.preventDefault();
    // console.log("here", inj_provider)
    try {
      setLoading(true);
      const res = await checkMapping(
        exitAddr,
        checkBox.checkedA,
        checkBox.checkedB
      );
      console.log(res);
      setMapped(res[0]);
      setMappedAddr(res[1]);
      setLoading(false);
      openModal();
    } catch (e) {
      setLoading(false);
      setError(e.message.substr(0, 70));
      console.error(e);
    }
  };

  const handleChange = (event) => {
    setCheckBox({ ...checkBox, [event.target.name]: event.target.checked });
  };

  return (
    <>
      <ResultModal
        mapping
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={{
          address: exitAddr,
          msg: "",
          mapped: mapped,
        }}
      />
      <form className={classes.formContainer} onSubmit={check}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <div className={classes.inputContainer}>
              <label htmlFor="address">Enter Address</label>
              <input
                type="text"
                placeholder="0xd52a861..."
                // className={`${errors.name ? classes.inputErr : ""}`}
                value={exitAddr}
                onChange={(e) => setExitAddr(e.target.value)}
                required
                name="address"
                id="address"
              />
            </div>
          </Grid>
          <Grid item>
            <div className={classes.flex}>
              <input
                type="checkbox"
                checked={checkBox.checkedA}
                onChange={handleChange}
                name="checkedA"
                id="root-chain"
                className={classes.checkbox}
              />
              <label htmlFor="root-chain" className={classes.labelSmall}>
                On Ethereum
              </label>
            </div>
          </Grid>
          <Grid item>
            <div className={classes.flex}>
              <input
                type="checkbox"
                checked={checkBox.checkedB}
                onChange={handleChange}
                name="checkedB"
                id="testnet"
                className={classes.checkbox}
              />
              <label htmlFor="testnet" className={classes.labelSmall}>
                Is Testnet
              </label>
            </div>
          </Grid>
        </Grid>

        <div className={classes.btnContainer}>
          <Button
            type="submit"
            className={`${classes.btn} ${classes.filled}`}
            disabled={loading}
          >
            {loading && (
              <CircularProgress className={classes.loading} size={24} />
            )}
            Check
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

  flex: {
    display: "flex",
    alignItems: "center",
    marginRight: "4px",
  },
  checkbox: {
    width: "22px",
    height: "22px",
    borderColor: "#C7CBD9",
    marginRight: "11px",
  },
  labelSmall: {
    fontSize: "14px",
    color: "#61677E",
    lineHeight: "21px",
    fontWeight: "600",
  },

  btnContainer: {
    marginTop: "35px",
  },
}));

export default FormMapping;
