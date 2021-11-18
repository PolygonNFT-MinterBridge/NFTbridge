import React, { useState } from "react";

// material UI
import { makeStyles } from "@material-ui/core/styles";

import ExitModal from "../Form/ExitModal";
import { useWeb3Context } from "../../contexts/Web3Context";

const NotificationItem = ({ data, active, db }) => {
  const classes = useStyles();
  const [triggerModal, setTriggerModal] = useState(false);

  const { providerChainId } = useWeb3Context();
  // redirect to etherscan or matic explorer
  const openExplorer = (tx) => {
    if (providerChainId === 1) window.open(`https://etherscan.io/tx/${tx}`);
    else window.open(`https://goerli.etherscan.io/tx/${tx}`);
  };

  const notificationAction = () => {
    data.txnType === "deposit"
      ? openExplorer(data.txn)
      : setTriggerModal(true)
  };

  return (
    <>
      <div
        className={`${classes.notificationItem} ${data.txnType === "deposit" && classes.deposit
          }`}
        onClick={notificationAction}
      >
        <div
          className="indicator"
          style={{ backgroundColor: `${active ? "#8247E5" : "transparent"}` }}
        ></div>
        <div className="details">
          <p className="notificationType">{data.txnType}</p>
          <p
            className="txn-details"
            style={{ color: `${active ? "#061024" : "#6E798F"}` }}
          >
            Txn:
            <span className="txn-address">{data.txn}</span>
          </p>
        </div>
      </div>

      {/* Exit Form Modal */}
      <ExitModal
        triggerModal={triggerModal}
        setTriggerModal={setTriggerModal}
        data={data}
        db={db}
      />
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  ...theme.overrides.formStyle,
  notificationItem: {
    width: "100%",
    backgroundColor: "#fff",
    padding: "16px 38px 16px 10px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    marginTop: "5px",
    cursor: "pointer",

    "& p": { margin: 0 },

    "& .notificationType": {
      fontSize: "12px",
      fontWeight: "600",
      color: "#6E798F",
      textTransform: "capitalize",
    },

    "& .indicator": {
      padding: "4px",
      borderRadius: "4px",
      marginRight: "10px",
    },

    "& .details": {
      width: "100%",

      "& .txn-details": {
        display: "flex",
        fontSize: "14px",
        color: "#6E798F",
        lineHeight: "19px",
      },

      "& .txn-address": {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "no-wrap",
        fontWeight: "bold",
        display: "block",
        width: "100%",
        paddingLeft: "5px",
      },
    },

    "&:hover": {
      backgroundColor: "#EDF0F7",
    },
  },

  deposit: {
    position: "relative",
    "&:hover": {
      "&::after": {
        content: "''",
        position: "absolute",
        top: "10px",
        right: "10px",
        width: "12px",
        height: "12px",
        backgroundImage: "URL('./img/launch.png')",
        backgroundSize: "14px",
        opacity: "0.65",
      },
    },
  },

  notificationForm: {
    backgroundColor: "#EDF0F7",
    padding: "20px 25px 30px",
  },
}));

export default NotificationItem;
